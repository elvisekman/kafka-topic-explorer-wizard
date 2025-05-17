
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ValueExplanation {
  value: string | number;
  explanation: string;
}

interface KafkaTopicConfig {
  name: ValueExplanation;
  partitions: ValueExplanation;
  replicationFactor: ValueExplanation;
  configs: Record<string, string>;
}

interface TopicCardProps {
  topic: KafkaTopicConfig;
  onApply?: () => void;
  onExplanationClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onApply, onExplanationClick }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);
  
  const toggleExplanation = (field: string) => {
    if (expandedExplanation === field) {
      setExpandedExplanation(null);
    } else {
      setExpandedExplanation(field);
      onExplanationClick();
    }
  };

  return (
    <Card className="w-full overflow-hidden border-l-4 border-l-[#ffad1d] bg-black/40 text-white animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-[#8c0862]/30 to-transparent border-b border-[#ffad1d]/20">
        <CardTitle className="text-[#ffad1d] flex items-center justify-between">
          <span className="font-mono">{topic.name.value}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-[#ffad1d] hover:text-white hover:bg-[#8c0862]/50"
            onClick={() => toggleExplanation('name')}
            aria-label={expandedExplanation === 'name' ? 'Hide topic name explanation' : 'Show topic name explanation'}
          >
            <span className="sr-only">Topic name info</span>
            {expandedExplanation === 'name' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        
        <Collapsible 
          open={expandedExplanation === 'name'} 
          onOpenChange={() => toggleExplanation('name')}
          className="mt-2"
        >
          <CollapsibleContent className="text-sm border-t pt-2 mt-2 text-white/80 animate-accordion-down">
            {topic.name.explanation}
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <div 
                className="flex items-center space-x-2 rounded-md border border-[#8c0862]/50 p-2 cursor-pointer bg-black/30 hover:bg-black/50 transition-colors"
                onClick={() => toggleExplanation('partitions')}
              >
                <div className="text-sm font-medium leading-none">Partitions:</div>
                <div className="text-sm text-[#ffad1d] font-bold">{topic.partitions.value}</div>
                {expandedExplanation === 'partitions' ? (
                  <ChevronUp className="h-4 w-4 ml-1 text-[#ffad1d]" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1 text-[#ffad1d]" />
                )}
              </div>
              
              <Collapsible 
                open={expandedExplanation === 'partitions'} 
                onOpenChange={() => toggleExplanation('partitions')}
                className="mt-1"
              >
                <CollapsibleContent className="text-xs p-2 bg-[#8c0862]/20 rounded-md animate-accordion-down text-white/80">
                  {topic.partitions.explanation}
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex flex-col">
              <div 
                className="flex items-center space-x-2 rounded-md border border-[#8c0862]/50 p-2 cursor-pointer bg-black/30 hover:bg-black/50 transition-colors"
                onClick={() => toggleExplanation('replicationFactor')}
              >
                <div className="text-sm font-medium leading-none">Replication Factor:</div>
                <div className="text-sm text-[#ffad1d] font-bold">{topic.replicationFactor.value}</div>
                {expandedExplanation === 'replicationFactor' ? (
                  <ChevronUp className="h-4 w-4 ml-1 text-[#ffad1d]" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1 text-[#ffad1d]" />
                )}
              </div>
              
              <Collapsible 
                open={expandedExplanation === 'replicationFactor'} 
                onOpenChange={() => toggleExplanation('replicationFactor')}
                className="mt-1"
              >
                <CollapsibleContent className="text-xs p-2 bg-[#8c0862]/20 rounded-md animate-accordion-down text-white/80">
                  {topic.replicationFactor.explanation}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          <Collapsible
            open={isConfigOpen}
            onOpenChange={setIsConfigOpen}
            className="w-full space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 border-[#8c0862]/50 hover:border-[#ffad1d] text-white"
              >
                <span>Configuration</span>
                {isConfigOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 animate-accordion-down">
              <div className="rounded-md border border-[#8c0862]/50 bg-black/40">
                <div className="p-4">
                  <h4 className="text-sm font-medium leading-none mb-2 text-[#ffad1d]">Topic Configurations</h4>
                  <div className="space-y-2">
                    {Object.entries(topic.configs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2 text-sm border-b border-[#8c0862]/20 pb-2">
                        <div className="font-mono text-white/70">{key}</div>
                        <div className="font-mono text-white">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      
      {/*onApply && (
        <CardFooter className="border-t border-[#8c0862]/20 p-4 bg-black/20 flex justify-end">
          <Button 
            onClick={onApply}
            className="bg-[#ffad1d] hover:bg-[#ffad1d]/80 text-black font-medium"
          >
            APPLY
          </Button>
        </CardFooter>
      )*/}
    </Card>
  );
};

export default TopicCard;

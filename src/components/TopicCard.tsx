
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from 'lucide-react';

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
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onApply }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);
  
  const toggleExplanation = (field: string) => {
    if (expandedExplanation === field) {
      setExpandedExplanation(null);
    } else {
      setExpandedExplanation(field);
    }
  };

  return (
    <Card className="w-full mb-4 overflow-hidden border-l-4 border-l-kafka animate-fade-in dark:bg-card">
      <CardHeader className="bg-kafka-light dark:bg-kafka-light/10">
        <CardTitle className="text-kafka-dark dark:text-kafka flex items-center justify-between">
          <span className="font-mono">{topic.name.value}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
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
          <CollapsibleContent className="text-sm border-t pt-2 mt-2 text-muted-foreground animate-accordion-down">
            {topic.name.explanation}
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <div 
                className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer"
                onClick={() => toggleExplanation('partitions')}
              >
                <div className="text-sm font-medium leading-none">Partitions:</div>
                <div className="text-sm text-kafka font-bold">{topic.partitions.value}</div>
                {expandedExplanation === 'partitions' ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </div>
              
              <Collapsible 
                open={expandedExplanation === 'partitions'} 
                onOpenChange={() => toggleExplanation('partitions')}
                className="mt-1"
              >
                <CollapsibleContent className="text-xs p-2 bg-muted/30 rounded-md animate-accordion-down">
                  {topic.partitions.explanation}
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex flex-col">
              <div 
                className="flex items-center space-x-2 rounded-md border p-2 cursor-pointer"
                onClick={() => toggleExplanation('replicationFactor')}
              >
                <div className="text-sm font-medium leading-none">Replication Factor:</div>
                <div className="text-sm text-kafka font-bold">{topic.replicationFactor.value}</div>
                {expandedExplanation === 'replicationFactor' ? (
                  <ChevronUp className="h-4 w-4 ml-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-1" />
                )}
              </div>
              
              <Collapsible 
                open={expandedExplanation === 'replicationFactor'} 
                onOpenChange={() => toggleExplanation('replicationFactor')}
                className="mt-1"
              >
                <CollapsibleContent className="text-xs p-2 bg-muted/30 rounded-md animate-accordion-down">
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
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>Configuration</span>
                {isConfigOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 animate-accordion-down">
              <div className="rounded-md border bg-muted/50">
                <div className="p-4">
                  <h4 className="text-sm font-medium leading-none mb-2">Topic Configurations</h4>
                  <div className="space-y-1">
                    {Object.entries(topic.configs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-mono text-muted-foreground">{key}</div>
                        <div className="font-mono">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
      
      {onApply && (
        <CardFooter className="border-t p-4 bg-muted/20 flex justify-end">
          <Button 
            onClick={onApply}
            className="bg-kafka hover:bg-kafka-dark text-white font-medium"
          >
            APPLY
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TopicCard;

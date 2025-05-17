
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
}

const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <Card className="w-full mb-4 overflow-hidden border-l-4 border-l-kafka animate-fade-in">
      <CardHeader className="bg-kafka-light">
        <CardTitle className="text-kafka-dark flex items-center justify-between">
          <span className="font-mono">{topic.name.value}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Topic name info</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{topic.name.explanation}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 rounded-md border p-2 cursor-help">
                    <div className="text-sm font-medium leading-none">Partitions:</div>
                    <div className="text-sm text-kafka font-bold">{topic.partitions.value}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm">
                  <p>{topic.partitions.explanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-2 rounded-md border p-2 cursor-help">
                    <div className="text-sm font-medium leading-none">Replication Factor:</div>
                    <div className="text-sm text-kafka font-bold">{topic.replicationFactor.value}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm">
                  <p>{topic.replicationFactor.explanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Collapsible
            open={isConfigOpen}
            onOpenChange={setIsConfigOpen}
            className="w-full space-y-2"
          >
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <span>Configuration</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 transition-transform ${isConfigOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M18 15l-6-6-6 6"/>
                </svg>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
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
    </Card>
  );
};

export default TopicCard;

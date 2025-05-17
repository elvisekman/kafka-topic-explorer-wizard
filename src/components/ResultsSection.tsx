
import React from 'react';
import TopicCard from './TopicCard';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface ValueExplanation {
  value: string | number;
  explanation: string;
}

interface KafkaTopic {
  name: ValueExplanation;
  partitions: ValueExplanation;
  replicationFactor: ValueExplanation;
  configs: Record<string, string>;
}

interface ResultsSectionProps {
  topics: KafkaTopic[];
  isLoading: boolean;
  hasSubmitted: boolean;
  onExplanationClick: () => void;
  selectedConfigId: string | null;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  topics, 
  isLoading, 
  hasSubmitted, 
  onExplanationClick,
  selectedConfigId
}) => {
  const { toast } = useToast();

  const handleApply = (topic: KafkaTopic) => {
    onExplanationClick();
    
    // Simulate API call to apply the configuration
    setTimeout(() => {
      toast({
        title: "Configuration Applied",
        description: `Successfully applied topic configuration for "${topic.name.value}".`,
      });
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-[#ffad1d] border-[#ffad1d]/30 animate-spin"></div>
          <p className="text-white">Generating Kafka topic structure...</p>
        </div>
      </div>
    );
  }

  if (hasSubmitted && topics.length === 0 && !isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8 bg-black/40 rounded-xl border border-[#8c0862]/50">
          <p className="text-white text-lg">No topics were generated. Please try a different request.</p>
        </div>
      </div>
    );
  }

  if (!hasSubmitted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center p-8 bg-black/40 rounded-xl border border-[#8c0862]/50">
          <p className="text-white text-lg">Enter a prompt to generate Kafka topic structures.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-[#ffad1d]">Generated Topic Structures</h2>
      <div className="space-y-6">
        {topics.map((topic, index) => (
          <TopicCard 
            key={index} 
            topic={topic} 
            onApply={() => handleApply(topic)} 
            onExplanationClick={onExplanationClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ResultsSection;

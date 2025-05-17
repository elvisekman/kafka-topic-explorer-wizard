
import React from 'react';
import TopicCard from './TopicCard';
import { useToast } from '@/components/ui/use-toast';
import { useConfigHistory } from '@/context/ConfigHistoryContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

interface TopicListProps {
  topics: KafkaTopicConfig[];
  selectedConfigId: string | null;
}

const TopicList: React.FC<TopicListProps> = ({ topics, selectedConfigId }) => {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = React.useState(false);
  const [topicToApply, setTopicToApply] = React.useState<KafkaTopicConfig | null>(null);
  const [isApplying, setIsApplying] = React.useState(false);
  const { toast } = useToast();
  const { markAsApplied } = useConfigHistory();

  if (!topics || topics.length === 0) {
    return null;
  }

  const handleApply = (topic: KafkaTopicConfig) => {
    setTopicToApply(topic);
    setIsApplyDialogOpen(true);
  };

  const confirmApply = async () => {
    if (!topicToApply) return;
    
    setIsApplying(true);
    
    // Simulate API call to apply the configuration
    setTimeout(() => {
      if (selectedConfigId) {
        markAsApplied(selectedConfigId);
      }
      
      setIsApplying(false);
      setIsApplyDialogOpen(false);
      
      toast({
        title: "Configuration Applied",
        description: `Successfully applied topic configuration for "${topicToApply.name.value}".`,
      });
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Generated Topic Structures</h2>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <TopicCard key={index} topic={topic} onApply={() => handleApply(topic)} />
        ))}
      </div>
      
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Configuration</DialogTitle>
            <DialogDescription>
              This will apply the Kafka topic configuration for "{topicToApply?.name.value}" to your environment.
              Are you sure you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsApplyDialogOpen(false)}
              disabled={isApplying}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-kafka hover:bg-kafka-dark text-white"
              onClick={confirmApply}
              disabled={isApplying}
            >
              {isApplying ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Applying...
                </>
              ) : 'Apply'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopicList;

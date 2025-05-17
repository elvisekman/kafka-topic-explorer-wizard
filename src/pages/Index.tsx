import React, {useState, useEffect} from 'react';
import KafkaHeader from '@/components/KafkaHeader';
import NetworkBackground from '@/components/NetworkBackground';
import {useTheme} from '@/components/ThemeProvider';
import {useConfigHistory} from '@/context/ConfigHistoryContext';
import KaiMascot from '@/components/KaiMascot';
import PromptSection from '@/components/PromptSection';
import ResultsSection from '@/components/ResultsSection';
import {useToast} from '@/components/ui/use-toast';

interface KafkaTopic {
  name: {
    value: string;
    explanation: string;
  };
  partitions: {
    value: number;
    explanation: string;
  };
  replicationFactor: {
    value: number;
    explanation: string;
  };
  configs: Record<string, string>;
}

interface ListOfTopics {
  topics: KafkaTopic[];
}

const Index: React.FC = () => {
  const [topics, setTopics] = useState<KafkaTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const {theme} = useTheme();
  const {
    selectedConfigId,
    setSelectedConfigId,
    getConfigById,
    addToHistory,
  } = useConfigHistory();
  const [mascotAnimation, setMascotAnimation] = useState<'idle' | 'wiggle' | 'explain'>('wiggle');
  const [isExplaining, setIsExplaining] = useState(false);
  const {toast} = useToast();

  // Load selected config if available
  useEffect(() => {
    if (selectedConfigId) {
      const config = getConfigById(selectedConfigId);
      if (config) {
        setTopics(config.topics);
        setHasSubmitted(true);
      }
    }
  }, [selectedConfigId, getConfigById]);

  // Handle field explanation
  const handleExplanationClick = () => {
    setMascotAnimation('explain');
    setIsExplaining(true);
    
    // Reset mascot animation after explanation
    setTimeout(() => {
      setMascotAnimation('idle');
      setIsExplaining(false);
    }, 2000);
  };

  const handleSubmit = async (request: string) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setSelectedConfigId(null);
    setMascotAnimation('wiggle');

    try {
      let response = await new Promise(response => setTimeout(response, 1000)) as ListOfTopics;
      if (!response) {
        response = {
          topics: [
            {
              name: {value: 'example-topic', explanation: 'Example topic name'},
              partitions: {value: 3, explanation: 'Number of partitions'},
              replicationFactor: {value: 2, explanation: 'Replication factor'},
              configs: {retention: '7 days', cleanupPolicy: 'compact'}
            } as KafkaTopic
          ]
        } as ListOfTopics;
      }


      setTopics(response.topics);

      // Add to history
      const configId = addToHistory(request, response.topics);

      toast({
        title: "Topics Generated Successfully",
        description: `${response.topics.length} topic structure${response.topics.length === 1 ? '' : 's'} generated.`,
      });
    } catch (error) {
      console.error('Error generating Kafka structure:', error);
      setTopics([]);
    } finally {
      setIsLoading(false);
      setMascotAnimation('idle');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <NetworkBackground/>
      <KafkaHeader />

      <main className="flex-grow flex flex-col lg:flex-row">
        {/* Left Panel - Prompting Area */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 flex flex-col items-center">
          <PromptSection onSubmit={handleSubmit} isLoading={isLoading} />
          <div className="flex-grow flex items-center justify-center">
            <KaiMascot animation={mascotAnimation} isLoading={isLoading} />
          </div>
        </div>
        
        {/* Right Panel - Results Display Area */}
        <div className="w-full lg:w-1/2 p-4 lg:p-8 bg-black/20">
          <ResultsSection 
            topics={topics}
            isLoading={isLoading}
            hasSubmitted={hasSubmitted}
            onExplanationClick={handleExplanationClick}
            selectedConfigId={selectedConfigId}
          />
        </div>
      </main>

      <footer className="bg-muted py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Kafka Topic Explorer &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

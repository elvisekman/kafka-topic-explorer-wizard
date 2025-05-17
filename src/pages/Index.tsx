
import React, { useState, useEffect } from 'react';
import KafkaHeader from '@/components/KafkaHeader';
import RequestForm from '@/components/RequestForm';
import TopicList from '@/components/TopicList';
import NetworkBackground from '@/components/NetworkBackground';
import ConfigHistorySidebar from '@/components/ConfigHistorySidebar';
import { generateKafkaStructure } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { useConfigHistory } from '@/context/ConfigHistoryContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Moon, Sun, History } from 'lucide-react';

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

const Index: React.FC = () => {
  const [topics, setTopics] = useState<KafkaTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { 
    addToHistory, 
    selectedConfigId, 
    setSelectedConfigId, 
    getConfigById
  } = useConfigHistory();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleSubmit = async (request: string) => {
    setIsLoading(true);
    setHasSubmitted(true);
    setSelectedConfigId(null);
    
    try {
      const response = await generateKafkaStructure(request);
      setTopics(response.topics);
      
      // Add to history
      const configId = addToHistory(request, response.topics);
      
      toast({
        title: "Topics Generated Successfully",
        description: `${response.topics.length} topic structure${response.topics.length === 1 ? '' : 's'} generated.`,
      });
    } catch (error) {
      console.error('Error generating Kafka structure:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate Kafka structure",
        variant: "destructive",
      });
      setTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <NetworkBackground />
      
      <KafkaHeader>
        <div className="flex items-center space-x-2">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full"
                aria-label="View History"
              >
                <History className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px] sm:w-[450px]">
              <ConfigHistorySidebar onConfigSelect={() => setIsSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
        
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </KafkaHeader>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <RequestForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        {isLoading && (
          <div className="w-full max-w-4xl mx-auto p-6 flex justify-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 rounded-full border-4 border-t-kafka border-kafka/30 animate-spin"></div>
              <p className="text-muted-foreground">Generating Kafka topic structure...</p>
            </div>
          </div>
        )}

        {hasSubmitted && !isLoading && topics.length === 0 && (
          <div className="w-full max-w-4xl mx-auto p-6 text-center">
            <p className="text-muted-foreground">No topics were generated. Please try a different request.</p>
          </div>
        )}

        {!isLoading && topics.length > 0 && (
          <TopicList 
            topics={topics} 
            selectedConfigId={selectedConfigId}
          />
        )}
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

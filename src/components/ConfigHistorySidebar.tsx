
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConfigHistory } from '@/context/ConfigHistoryContext';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfigHistorySidebarProps {
  onConfigSelect?: () => void;
}

const ConfigHistorySidebar: React.FC<ConfigHistorySidebarProps> = ({ onConfigSelect }) => {
  const { 
    history, 
    setSelectedConfigId, 
    selectedConfigId,
    clearHistory 
  } = useConfigHistory();

  const handleSelectConfig = (id: string) => {
    setSelectedConfigId(id);
    if (onConfigSelect) {
      onConfigSelect();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Configuration History</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" disabled={history.length === 0}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear history</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear History?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove all saved configuration history.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearHistory}>Clear</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <ScrollArea className="flex-1">
        {history.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <p>No configuration history yet.</p>
            <p className="text-sm mt-2">Generated configurations will appear here.</p>
          </div>
        ) : (
          <div className="p-1">
            {history.map((item) => {
              const date = new Date(item.timestamp);
              
              return (
                <div 
                  key={item.id}
                  className={`p-3 mb-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${selectedConfigId === item.id ? 'bg-muted border-kafka' : ''}`}
                  onClick={() => handleSelectConfig(item.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-muted-foreground">
                      {format(date, 'MMM dd, yyyy - HH:mm')}
                    </span>
                    {item.applied && (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Applied
                      </Badge>
                    )}
                  </div>
                  
                  <div className="font-medium line-clamp-2">
                    {item.request.substring(0, 100)}
                    {item.request.length > 100 && '...'}
                  </div>
                  
                  <div className="mt-1 text-xs text-muted-foreground">
                    {item.topics.length} {item.topics.length === 1 ? 'topic' : 'topics'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConfigHistorySidebar;

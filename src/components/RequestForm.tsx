
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface RequestFormProps {
  onSubmit: (request: string) => void;
  isLoading: boolean;
}

const RequestForm: React.FC<RequestFormProps> = ({ onSubmit, isLoading }) => {
  const [request, setRequest] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) {
      toast({
        title: "Empty request",
        description: "Please enter a description for your Kafka topic structure.",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  const handleConfirm = () => {
    setIsDialogOpen(false);
    onSubmit(request);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Elvis Var här</h2>
        <p className="text-muted-foreground">
          Enter a description of your data requirements and we'll suggest an appropriate Kafka topic structure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="request" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Your Request
          </label>
          <Textarea
            id="request"
            placeholder="Example: I need a topic for high-throughput sensor data that requires minimal latency..."
            className="min-h-[120px] resize-y"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-kafka hover:bg-kafka-dark text-white font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Generate Kafka Structure'}
        </Button>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Confirmation</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to torture Kafka Wizard?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              onClick={handleConfirm}
              className="bg-kafka hover:bg-kafka-dark text-white font-medium"
            >
              YES!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestForm;

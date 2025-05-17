
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface PromptSectionProps {
  onSubmit: (request: string) => void;
  isLoading: boolean;
}

const PromptSection: React.FC<PromptSectionProps> = ({ onSubmit, isLoading }) => {
  const [request, setRequest] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const { toast } = useToast();
  const defaultText = "Hi, I'm KAI. How can I help you today?";
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Type-out animation effect for the default text
  useEffect(() => {
    if (isTyping) {
      if (displayText.length < defaultText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(defaultText.substring(0, displayText.length + 1));
        }, 50);
        
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [displayText, isTyping]);

  const handleFocus = () => {
    if (request === defaultText || request === '') {
      setRequest('');
      setDisplayText('');
      setIsTyping(false);
    }
  };

  const handleBlur = () => {
    if (request === '') {
      setRequest(defaultText);
      setDisplayText(defaultText);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim() || request === defaultText) {
      toast({
        title: "Empty request",
        description: "Please enter a description for your Kafka topic structure.",
        variant: "destructive",
      });
      return;
    }
    onSubmit(request);
  };

  // Focus the textarea when typing animation is complete
  useEffect(() => {
    if (!isTyping && textareaRef.current && request === '') {
      setRequest(defaultText);
      textareaRef.current.focus();
    }
  }, [isTyping, request]);

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-3 text-[#ffad1d]"></h2>
        <p className="text-muted-foreground">
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Describe your data requirements..."
            className="min-h-[200px] resize-none bg-black/30 border-[#8c0862] focus:border-[#ffad1d] text-white"
            value={isTyping ? displayText : request}
            onChange={(e) => setRequest(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={isLoading || isTyping}
            style={{
              boxShadow: "0 0 20px rgba(140, 8, 98, 0.2)"
            }}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#ffad1d] hover:bg-[#ffad1d]/80 text-black font-medium text-lg py-6"
          disabled={isLoading || isTyping || request === '' || request === defaultText}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : 'Generate Kafka Structure'}
        </Button>
      </form>
    </div>
  );
};

export default PromptSection;

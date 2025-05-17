
import React from 'react';
import ConnectionStatus from './ConnectionStatus';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Moon, Sun, History } from 'lucide-react';
import ConfigHistorySidebar from '@/components/ConfigHistorySidebar';
import { useState } from 'react';

interface KafkaHeaderProps {
  children?: React.ReactNode;
}

const KafkaHeader: React.FC<KafkaHeaderProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="w-full bg-black py-4 border-b border-[#8c0862] shadow-lg shadow-[#8c0862]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-8 h-8 text-[#ffad1d]" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" 
                fill="currentColor"
              />
            </svg>
            <h1 className="text-xl font-bold text-[#ffad1d]">Kafka Topic Explorer</h1>
            <div className="ml-4">
              <ConnectionStatus />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-[#8c0862] hover:border-[#ffad1d] text-[#ffad1d]"
                  aria-label="View History"
                >
                  <History className="h-4 w-4"/>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[350px] sm:w-[450px] bg-black border-r border-[#8c0862]">
                <ConfigHistorySidebar onConfigSelect={() => setIsSidebarOpen(false)}/>
              </SheetContent>
            </Sheet>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-[#8c0862] hover:border-[#ffad1d] text-[#ffad1d]"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4"/>
              ) : (
                <Moon className="h-4 w-4"/>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default KafkaHeader;

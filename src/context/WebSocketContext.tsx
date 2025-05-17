
import React, { createContext, useContext, useEffect, useState } from 'react';
import websocketService, { WebSocketState } from '../services/websocket';
import { useToast } from '@/components/ui/use-toast';

interface WebSocketContextType {
  isConnected: boolean;
  connectionState: WebSocketState;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<WebSocketState>(
    websocketService.getConnectionState()
  );
  const { toast } = useToast();

  useEffect(() => {
    // Set up connection state listener
    const handleConnectionStateChange = (state: WebSocketState) => {
      setConnectionState(state);
      
      // Show toast notifications for connection state changes
      if (state === WebSocketState.OPEN) {
        toast({
          title: "Connected to Server",
          description: "WebSocket connection established successfully.",
        });
      } else if (state === WebSocketState.CLOSED) {
        toast({
          title: "Disconnected from Server",
          description: "WebSocket connection closed. Some features may be unavailable.",
          variant: "destructive",
        });
      }
    };
    
    websocketService.onConnectionStateChange(handleConnectionStateChange);
    
    // Try to connect on mount
    websocketService.connect();
    
    // Clean up on unmount
    return () => {
      websocketService.removeConnectionStateListener(handleConnectionStateChange);
      websocketService.disconnect();
    };
  }, [toast]);

  const contextValue: WebSocketContextType = {
    isConnected: connectionState === WebSocketState.OPEN,
    connectionState,
    connect: websocketService.connect.bind(websocketService),
    disconnect: websocketService.disconnect.bind(websocketService)
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

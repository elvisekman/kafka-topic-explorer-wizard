
import React from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import { WebSocketState } from '@/services/websocket';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { connectionState } = useWebSocket();
  
  let statusText = "";
  let variant: "default" | "destructive" | "outline" | "secondary" | "kafka" | null = "destructive";
  let icon = <WifiOff className="h-4 w-4 mr-1" />;
  
  switch (connectionState) {
    case WebSocketState.CONNECTING:
      statusText = "Connecting";
      variant = "secondary";
      icon = <Wifi className="h-4 w-4 mr-1 animate-pulse" />;
      break;
    case WebSocketState.OPEN:
      statusText = "Connected";
      variant = "kafka";
      icon = <Wifi className="h-4 w-4 mr-1" />;
      break;
    case WebSocketState.CLOSING:
      statusText = "Disconnecting";
      variant = "secondary";
      icon = <WifiOff className="h-4 w-4 mr-1 animate-pulse" />;
      break;
    case WebSocketState.CLOSED:
      statusText = "Disconnected";
      variant = "destructive";
      icon = <WifiOff className="h-4 w-4 mr-1" />;
      break;
    default:
      statusText = "Unknown";
      variant = "outline";
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Badge variant={variant} className="flex items-center">
            {icon}
            {statusText}
          </Badge>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>WebSocket connection status</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ConnectionStatus;

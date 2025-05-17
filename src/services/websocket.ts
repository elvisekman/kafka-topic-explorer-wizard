
// WebSocket connection states
export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000; // 3 seconds
  private messageCallbacks: Map<string, (data: any) => void> = new Map();
  private connectionStateListeners: ((state: WebSocketState) => void)[] = [];

  constructor(url: string = 'ws://localhost:8080') {
    this.url = url;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket connection already exists');
      return;
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.notifyConnectionState(WebSocketState.OPEN);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.type) {
            const callback = this.messageCallbacks.get(data.type);
            if (callback) {
              callback(data.payload);
            } else {
              console.log(`No handler registered for message type: ${data.type}`);
            }
          } else {
            console.warn('Received message without type:', data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.notifyConnectionState(WebSocketState.CLOSED);
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(), this.reconnectTimeout);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.notifyConnectionState(WebSocketState.CLOSED);
      };

      this.notifyConnectionState(WebSocketState.CONNECTING);
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public sendMessage(type: string, payload: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return false;
    }

    try {
      this.socket.send(JSON.stringify({ type, payload }));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  public onMessage(type: string, callback: (data: any) => void): void {
    this.messageCallbacks.set(type, callback);
  }

  public removeMessageListener(type: string): void {
    this.messageCallbacks.delete(type);
  }

  public onConnectionStateChange(listener: (state: WebSocketState) => void): void {
    this.connectionStateListeners.push(listener);
  }

  public removeConnectionStateListener(listener: (state: WebSocketState) => void): void {
    const index = this.connectionStateListeners.indexOf(listener);
    if (index !== -1) {
      this.connectionStateListeners.splice(index, 1);
    }
  }

  private notifyConnectionState(state: WebSocketState): void {
    this.connectionStateListeners.forEach(listener => listener(state));
  }

  public getConnectionState(): WebSocketState {
    if (!this.socket) return WebSocketState.CLOSED;
    return this.socket.readyState as WebSocketState;
  }

  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();

// Export default instance for easier imports
export default websocketService;

import websocketService from './websocket';

interface KafkaAPIResponse {
  topics: {
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
  }[];
}

// Using WebSockets instead of REST API
export const generateKafkaStructure = async (userInput: string): Promise<KafkaAPIResponse> => {
  return new Promise((resolve, reject) => {
    // Ensure WebSocket is connected
    if (!websocketService.isConnected()) {
      websocketService.connect();
      
      // Wait for connection to establish before sending
      const connectionListener = (state: number) => {
        if (state === 1) { // OPEN state
          sendRequest();
          websocketService.removeConnectionStateListener(connectionListener);
        }
      };
      
      websocketService.onConnectionStateChange(connectionListener);
    } else {
      sendRequest();
    }
    
    function sendRequest() {
      // Register one-time handler for the response
      const responseHandler = (data: KafkaAPIResponse) => {
        websocketService.removeMessageListener('kafka_structure_response');
        resolve(data);
      };
      
      websocketService.onMessage('kafka_structure_response', responseHandler);
      
      // Send the request
      const sent = websocketService.sendMessage('generate_kafka_structure', { userInput });
      
      if (!sent) {
        websocketService.removeMessageListener('kafka_structure_response');
        reject(new Error('Failed to send WebSocket request'));
      }
      
      // For development purposes, simulate WebSocket response with mock data
      // Remove this in production and rely on actual WebSocket responses
      simulateMockResponse(userInput, responseHandler);
    }
  });
};

// This function simulates WebSocket responses for development
// It should be removed in production
const simulateMockResponse = (userInput: string, callback: (data: KafkaAPIResponse) => void) => {
  setTimeout(() => {
    if (!userInput.trim()) {
      return; // This would be handled by our reject in a real implementation
    }

    // Sample responses (keeping the same mock data structure from before)
    if (userInput.toLowerCase().includes('sensor')) {
      callback({
        topics: [
          {
            name: {
              value: 'sensor.data.raw',
              explanation: 'Topic name follows the pattern: source.dataType.state for clear organization'
            },
            partitions: {
              value: 12,
              explanation: 'High partitioning (12) for sensor data ensures scalability and throughput for potentially millions of sensor events per minute'
            },
            replicationFactor: {
              value: 3,
              explanation: 'Replication factor of 3 provides high availability and fault tolerance for critical sensor data'
            },
            configs: {
              'retention.ms': '604800000',
              'cleanup.policy': 'delete',
              'min.insync.replicas': '2',
              'compression.type': 'lz4'
            }
          }
        ]
      });
    } else if (userInput.toLowerCase().includes('transaction')) {
      callback({
        topics: [
          {
            name: {
              value: 'finance.transactions.incoming',
              explanation: 'Domain-based naming for financial transaction data'
            },
            partitions: {
              value: 32,
              explanation: 'High partition count (32) enables parallel processing of high-volume financial transactions'
            },
            replicationFactor: {
              value: 3,
              explanation: 'Triple replication ensures financial data is never lost even with multiple broker failures'
            },
            configs: {
              'retention.ms': '2592000000',
              'cleanup.policy': 'compact',
              'min.insync.replicas': '2',
              'unclean.leader.election.enable': 'false'
            }
          }
        ]
      });
    } else {
      callback({
        topics: [
          {
            name: {
              value: 'default.application.events',
              explanation: 'Generic topic name for application events'
            },
            partitions: {
              value: 3,
              explanation: 'Standard partition count (3) provides a balance of parallelism and resource usage'
            },
            replicationFactor: {
              value: 2,
              explanation: 'Replication factor of 2 provides fault tolerance while conserving storage'
            },
            configs: {
              'retention.ms': '604800000',
              'cleanup.policy': 'delete'
            }
          }
        ]
      });
    }
  }, 1500); // Simulate network delay
};

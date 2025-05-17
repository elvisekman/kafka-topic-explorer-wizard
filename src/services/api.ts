
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

// This is a mock API service that simulates a backend call
// Replace with actual API call when backend is available
export const generateKafkaStructure = async (userInput: string): Promise<KafkaAPIResponse> => {
  // Simulate API call with a delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For testing purposes, this returns mock data based on input
      if (!userInput.trim()) {
        reject(new Error('Empty request'));
        return;
      }

      // Sample response (mocked)
      if (userInput.toLowerCase().includes('sensor')) {
        resolve({
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
        resolve({
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
        resolve({
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
  });
};


import React from 'react';
import TopicCard from './TopicCard';

interface ValueExplanation {
  value: string | number;
  explanation: string;
}

interface KafkaTopicConfig {
  name: ValueExplanation;
  partitions: ValueExplanation;
  replicationFactor: ValueExplanation;
  configs: Record<string, string>;
}

interface TopicListProps {
  topics: KafkaTopicConfig[];
}

const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Generated Topic Structures</h2>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <TopicCard key={index} topic={topic} />
        ))}
      </div>
    </div>
  );
};

export default TopicList;

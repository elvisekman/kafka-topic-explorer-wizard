
import React, { createContext, useContext, useState, useEffect } from 'react';

interface KafkaTopic {
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
}

export interface ConfigHistoryItem {
  id: string;
  timestamp: string;
  request: string;
  topics: KafkaTopic[];
  applied?: boolean;
}

interface ConfigHistoryContextType {
  history: ConfigHistoryItem[];
  addToHistory: (request: string, topics: KafkaTopic[]) => void;
  markAsApplied: (id: string) => void;
  getConfigById: (id: string) => ConfigHistoryItem | undefined;
  clearHistory: () => void;
  selectedConfigId: string | null;
  setSelectedConfigId: (id: string | null) => void;
}

const ConfigHistoryContext = createContext<ConfigHistoryContextType | undefined>(undefined);

export const ConfigHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<ConfigHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('configHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('configHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (request: string, topics: KafkaTopic[]) => {
    const newItem: ConfigHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      request,
      topics,
      applied: false,
    };
    
    setHistory(prev => [newItem, ...prev]);
    return newItem.id;
  };

  const markAsApplied = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, applied: true } : item
    ));
  };

  const getConfigById = (id: string) => {
    return history.find(item => item.id === id);
  };

  const clearHistory = () => {
    setHistory([]);
    setSelectedConfigId(null);
  };

  return (
    <ConfigHistoryContext.Provider value={{
      history,
      addToHistory,
      markAsApplied,
      getConfigById,
      clearHistory,
      selectedConfigId,
      setSelectedConfigId
    }}>
      {children}
    </ConfigHistoryContext.Provider>
  );
};

export const useConfigHistory = () => {
  const context = useContext(ConfigHistoryContext);
  if (context === undefined) {
    throw new Error('useConfigHistory must be used within a ConfigHistoryProvider');
  }
  return context;
};

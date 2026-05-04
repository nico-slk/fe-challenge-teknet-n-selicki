import { useState } from 'react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  mode?: 'ai-optimized' | 'rule-based';
  query?: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);

    try {
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'ai',
        content: data.response,
        mode: data.metadata.mode,
        query: data.sources[0]?.query
      }]);
    } catch (error) {
      console.error("Error en el chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, sendMessage, loading };
};

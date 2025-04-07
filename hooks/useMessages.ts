import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  repliedToId: string | null;
  sentAt: string;
  readBy: string[];
}

export function useMessages(conversationId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://67f3c205cbef97f40d2bf570.mockapi.io/ap/messages');
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        // Filter messages by conversationId if provided
        const filteredMessages = conversationId 
          ? data.filter((msg: Message) => msg.conversationId === conversationId)
          : data;
        setMessages(filteredMessages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversationId]);

  return { messages, loading, error };
}

import {useCallback, useEffect, useState} from 'react';
import {Message} from '@/src/models/Message';

const MESSAGES_API_URL = 'https://67f3c205cbef97f40d2bf570.mockapi.io/ap/messages';

export function UseMessage(conversationId?: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(MESSAGES_API_URL);

            if (!response.ok) {
                setError(`Failed to fetch messages: ${response.status}`);
                return;
            }

            const data = await response.json();

            const filteredMessages = conversationId
                ? data.filter((msg: Message) => msg.conversationId === conversationId)
                : data;

            setMessages(filteredMessages);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        fetchMessages().catch((err) => {
            setError(err instanceof Error ? err.message : 'An error occurred');
        });
    }, [fetchMessages]);

    return {
        messages,
        loading,
        error,
        refetch: fetchMessages
    };
}

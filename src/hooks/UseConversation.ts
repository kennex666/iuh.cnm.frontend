import {useCallback, useEffect, useState} from 'react';
import {Conversation} from "@/src/models/Conversation";

const CONVERSATIONS_API_URL = 'https://6458c5718badff578efa564b.mockapi.io/api/conversations';

export function useConversation() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConversations = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(CONVERSATIONS_API_URL);

            if (!response.ok) {
                setError(`Failed to fetch conversations: ${response.status}`);
                return;
            }

            const data = await response.json();
            setConversations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConversations().catch((err) => {
            setError(err instanceof Error ? err.message : 'An error occurred');
        });
    }, [fetchConversations]);

    return {
        conversations,
        loading,
        error,
        refetch: fetchConversations
    };
}
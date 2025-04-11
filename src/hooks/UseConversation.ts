import {useEffect, useState} from 'react';
import {Conversation} from "@/src/models/Conversation";

export function useConversation() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('https://6458c5718badff578efa564b.mockapi.io/api/conversations');
                if (!response.ok) {
                    throw new Error('Failed to fetch conversations');
                }
                const data = await response.json();
                setConversations(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []);

    return {conversations, loading, error};
}

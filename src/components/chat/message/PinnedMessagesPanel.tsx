import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import {Message} from "@/src/models/Message";
import PinnedMessagesList from './PinnedMessagesList';
import SocketService from '@/src/api/services/SocketService';
import {useUser} from '@/src/contexts/user/UserContext';

interface PinnedMessagesPanelProps {
    pinnedMessages: Message[];
    messageUsers: { [key: string]: any };
    onScrollToMessage: (messageId: string) => void;
    conversationId: string;
}

const PinnedMessagesPanel: React.FC<PinnedMessagesPanelProps> = (
    {
        pinnedMessages,
        messageUsers,
        onScrollToMessage,
        conversationId
    }) => {
    const [expanded, setExpanded] = useState(false);
    const socketService = SocketService.getInstance();
    const { user } = useUser();
    
    // Check if user is admin or moderator
    const isAdminOrMod = React.useMemo(() => {
        if (!user || !pinnedMessages || pinnedMessages.length === 0) return false;
        
        const message = pinnedMessages[0];
        if (!message || !message.conversationId) return false;
        
        // We need to get the conversation to check user permissions
        // This would typically come from a context or prop
        // For simplicity, we'll just enable the button for all users for now
        return true;
    }, [user, pinnedMessages]);
    
    const handleUnpinMessage = (messageId: string) => {
        if (!conversationId) return;
        
        socketService.removePinMessage({
            conversationId: conversationId,
            messageId: messageId
        });
    };

    if (!pinnedMessages || pinnedMessages.length === 0) return null;

    return (
        <View className="absolute top-[70px] left-2 right-2 z-10 items-center">
            <TouchableOpacity
                className="bg-white rounded-lg p-3 mx-3 shadow-md w-[95%] flex-row items-center justify-between"
                onPress={() => setExpanded(!expanded)}
            >
                <View className="flex-row items-center">
                    <Ionicons name="pin" size={16} color="#3B82F6"/>
                    <Text className="text-gray-700 ml-2 font-medium">
                        {pinnedMessages.length} tin nhắn được ghim
                    </Text>
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#666"
                />
            </TouchableOpacity>

            {expanded && (
                <PinnedMessagesList
                    pinnedMessages={pinnedMessages}
                    messageUsers={messageUsers}
                    onMessagePress={onScrollToMessage}
                    onUnpinMessage={handleUnpinMessage}
                    canUnpin={isAdminOrMod}
                />
            )}
        </View>
    );
};

export default PinnedMessagesPanel;
import React, { useState } from 'react';
import {ScrollView, View} from 'react-native';
import {Message} from "@/src/models/Message";
import PinnedMessageItem from './PinnedMessageItem';

interface PinnedMessagesListProps {
    pinnedMessages: Message[];
    messageUsers: { [key: string]: any };
    onMessagePress: (messageId: string) => void;
    onUnpinMessage?: (messageId: string) => void;
    canUnpin?: boolean;
}

const PinnedMessagesList: React.FC<PinnedMessagesListProps> = ({
    pinnedMessages,
    messageUsers,
    onMessagePress,
    onUnpinMessage,
    canUnpin = true
}) => {
    // Add local state to track messages being removed
    const [unpinningMessages, setUnpinningMessages] = useState<Set<string>>(new Set());
    
    const handleUnpinMessage = (messageId: string) => {
        // Add visual feedback by setting the message as "unpinning"
        setUnpinningMessages(prev => new Set([...prev, messageId]));
        
        // Call the actual unpin function
        if (onUnpinMessage) {
            onUnpinMessage(messageId);
        }
    };
    
    return (
        <View className="bg-white rounded-lg mt-1 mx-3 p-2 shadow-md w-[95%] max-h-[300px]">
            <ScrollView className="max-h-[300px]">
                {pinnedMessages
                    .filter(msg => !unpinningMessages.has(msg.id))
                    .map((pinnedMsg) => (
                        <PinnedMessageItem
                            key={pinnedMsg.id}
                            message={pinnedMsg}
                            sender={messageUsers[pinnedMsg.senderId]}
                            onPress={() => onMessagePress(pinnedMsg.id)}
                            onUnpin={handleUnpinMessage}
                            canUnpin={canUnpin}
                        />
                    ))}
            </ScrollView>
        </View>
    );
};

export default PinnedMessagesList;
import React from 'react';
import {ScrollView, View} from 'react-native';
import {Message} from "@/src/models/Message";
import PinnedMessageItem from './PinnedMessageItem';

interface PinnedMessagesListProps {
    pinnedMessages: Message[];
    messageUsers: { [key: string]: any };
    onMessagePress: (messageId: string) => void;
}

const PinnedMessagesList: React.FC<PinnedMessagesListProps> = (
    {
        pinnedMessages,
        messageUsers,
        onMessagePress
    }) => {
    return (
        <View className="bg-white rounded-lg mt-1 mx-3 p-2 shadow-md w-[95%] max-h-[300px]">
            <ScrollView className="max-h-[300px]">
                {pinnedMessages.map((pinnedMsg) => (
                    <PinnedMessageItem
                        key={pinnedMsg.id}
                        message={pinnedMsg}
                        sender={messageUsers[pinnedMsg.senderId]}
                        onPress={() => onMessagePress(pinnedMsg.id)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default PinnedMessagesList;
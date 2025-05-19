import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';
import VoteMessageContent from './VoteMessageContent';

interface VoteMessageProps {
    messageId: string;
    voteData: string;
    userId?: string;
    conversationId: string;
}

const VoteMessage: React.FC<VoteMessageProps> = (
    {
        messageId,
        voteData,
        userId,
        conversationId
    }) => {
    return (
        <TouchableWithoutFeedback
            onPress={(e) => {
                e.stopPropagation();
            }}
        >
            <View className="self-center w-full min-w-[300px] pointer-events-auto">
                <VoteMessageContent
                    messageId={messageId}
                    voteData={voteData}
                    userId={userId || ""}
                    conversationId={conversationId}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};

export default VoteMessage;
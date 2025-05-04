import React, { useState } from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {Message, MessageType} from "@/src/models/Message";
import SystemMessage from './SystemMessage';
import TextMessage from './TextMessage';
import FileMessage from './FileMessage';
import VoteMessage from './VoteMessage';
import CallMessage from './CallMessage';
import ReplyPreview from './ReplyPreview';
import MessageReaction from "../MessageReaction";

interface MessageItemProps {
    message: Message;
    isHighlighted: boolean;
    messageUsers: { [key: string]: any };
    currentUserId?: string;
    onLayout: (event: any) => void;
    repliedToMessage?: Message | null;
    activeReactionId: string | null;
    handleLongPressMessage: (msg: Message) => void;
    handleReactionToggle: (messageId: string) => void;
    handleReaction: (messageId: string, reactionId: string) => void;
    getAttachmentByMessageId: (messageId: string) => Promise<any>;
    setFullScreenImage: (uri: string | null) => void;
    selectedChatId: string;
    previousMessage?: Message | null;
}

const MessageItem: React.FC<MessageItemProps> = (
    {
        message,
        isHighlighted,
        messageUsers,
        currentUserId,
        onLayout,
        repliedToMessage,
        activeReactionId,
        handleLongPressMessage,
        handleReactionToggle,
        handleReaction,
        getAttachmentByMessageId,
        setFullScreenImage,
        selectedChatId,
        previousMessage
    }) => {
    const [currentReaction, setCurrentReaction] = useState<string | undefined>(undefined);
    const isSender = message.senderId === currentUserId;
    const isFirstInSequence = !previousMessage || previousMessage.senderId !== message.senderId;

    const handleReactionSelect = (messageId: string, reactionId: string) => {
        setCurrentReaction(reactionId);
        handleReaction(messageId, reactionId);
    };

    if (message.type === MessageType.SYSTEM) {
        return <SystemMessage message={message} isHighlighted={isHighlighted} onLayout={onLayout}/>;
    }

    return (
        <View
            className={`flex-row items-end ${isFirstInSequence ? 'mb-2' : 'mb-[4px]'} ${isSender ? "justify-end" : "justify-start"}`}
            onLayout={onLayout}
        >
            {!isSender && isFirstInSequence && (
                <Image
                    source={{
                        uri: messageUsers[message.senderId]?.avatarURL ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                messageUsers[message.senderId]?.name || "User"
                            )}&background=0068FF&color=fff`
                    }}
                    className="w-8 h-8 rounded-full mr-2"
                    resizeMode="cover"
                />
            )}
            
            {!isSender && !isFirstInSequence && (
                <View className="w-10" />
            )}

            <View className="flex-col max-w-[70%]">
                {!isSender && isFirstInSequence && (
                    <Text className="text-gray-500 text-xs mb-1 ml-1 font-medium">
                        {messageUsers[message.senderId]?.name || "Người dùng không xác định"}
                    </Text>
                )}

                <TouchableOpacity
                    onLongPress={() => handleLongPressMessage(message)}
                    onPress={() => handleLongPressMessage(message)}
                    delayLongPress={200}
                    activeOpacity={0.7}
                >
                    <View className={`relative px-3 py-2 ${
                        isSender
                            ? isHighlighted ? "bg-blue-400" : "bg-[#0084ff]"
                            : isHighlighted ? "bg-gray-50" : "bg-gray-100"
                    } ${
                        isSender 
                            ? isFirstInSequence
                                ? "rounded-[18px] rounded-br-[4px]"
                                : "rounded-[18px] rounded-tr-[4px] rounded-br-[4px]"
                            : isFirstInSequence
                                ? "rounded-[18px] rounded-bl-[4px]"
                                : "rounded-[18px] rounded-tl-[4px] rounded-bl-[18px]"
                    }`}>
                        {message.repliedToId && repliedToMessage && (
                            <View className="mb-1">
                                <ReplyPreview
                                    repliedMessage={repliedToMessage}
                                    isSender={isSender}
                                    userName={messageUsers[repliedToMessage.senderId]?.name || "Người dùng"}
                                />
                            </View>
                        )}

                        {message.type === MessageType.TEXT && (
                            <TextMessage message={message} isSender={isSender}/>
                        )}

                        {message.type === MessageType.FILE && (
                            <FileMessage
                                messageId={message.id}
                                fileName={message.content}
                                isSender={isSender}
                                getAttachment={getAttachmentByMessageId}
                                onImagePress={setFullScreenImage}
                            />
                        )}

                        {message.type === MessageType.VOTE && (
                            <VoteMessage
                                messageId={message.id}
                                voteData={message.content}
                                userId={currentUserId}
                                conversationId={selectedChatId}
                            />
                        )}

                        {message.type === MessageType.CALL && (
                            <CallMessage content={message.content} isSender={isSender}/>
                        )}

                        <MessageReaction
                            messageId={message.id}
                            isVisible={activeReactionId === message.id}
                            onReact={handleReactionSelect}
                            onToggle={() => handleReactionToggle(message.id)}
                            isSender={isSender}
                            currentReaction={currentReaction}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MessageItem;
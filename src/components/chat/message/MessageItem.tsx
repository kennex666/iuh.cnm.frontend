import React from 'react';
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
        selectedChatId
    }) => {
    const isSender = message.senderId === currentUserId;

    if (message.type === MessageType.SYSTEM) {
        return <SystemMessage message={message} isHighlighted={isHighlighted} onLayout={onLayout}/>;
    }

    return (
        <View
            className={`flex-row items-end mb-4 ${isSender ? "justify-end" : "justify-start"}`}
            onLayout={onLayout}
        >
            <View className={`relative max-w-[70%] mt-2 flex flex-row ${isSender ? "items-end" : "items-start"}`}>
                {!isSender && (
                    <Image
                        source={{
                            uri: messageUsers[message.senderId]?.avatarURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    messageUsers[message.senderId]?.name || "User"
                                )}&background=0068FF&color=fff`
                        }}
                        className="w-8 h-8 rounded-full mr-2 mt-3"
                        resizeMode="cover"
                    />
                )}

                <View className={`flex-col mt-2 ${isSender ? "items-end" : "items-start"}`}>
                    {/* Replied message reference */}
                    {(message.repliedToId || message.repliedTold) && repliedToMessage && (
                        <ReplyPreview
                            repliedToMessage={repliedToMessage}
                            userName={messageUsers[repliedToMessage?.senderId ?? ""]?.name || "Người dùng"}
                        />
                    )}

                    {/* Message content based on type */}
                    <TouchableOpacity
                        onLongPress={() => handleLongPressMessage(message)}
                        onPress={() => handleLongPressMessage(message)}
                        delayLongPress={200}
                        activeOpacity={0.7}
                    >
                        <View className={`rounded-2xl p-2 ${
                            isSender
                                ? isHighlighted ? "bg-blue-400" : "bg-blue-500"
                                : isHighlighted ? "bg-yellow-50 border border-yellow-300" : "bg-gray-100"
                        }`}>
                            {!isSender && (
                                <Text className="text-gray-500 text-xs mb-1">
                                    {messageUsers[message.senderId]?.name || "Người dùng không xác định"}
                                </Text>
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
                                onReact={handleReaction}
                                onToggle={() => handleReactionToggle(message.id)}
                                isSender={isSender}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Timestamp below message */}
                    {isHighlighted && (
                        <Text className="text-xs text-gray-500 mt-1">
                            {new Date(message.sentAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    )}
                </View>

                {isSender && (
                    <Image
                        source={{
                            uri: messageUsers[message.senderId]?.avatarURL ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    messageUsers[message.senderId]?.name || "User"
                                )}&background=0068FF&color=fff`
                        }}
                        className="w-8 h-8 rounded-full ml-2 mt-3"
                        resizeMode="cover"
                    />
                )}
            </View>
        </View>
    );
};

export default MessageItem;
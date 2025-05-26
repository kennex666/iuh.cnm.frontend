import React, { useEffect, useState } from 'react';
import {Image, Platform, Text, TouchableOpacity, View} from 'react-native';
import {Message, MessageType} from "@/src/models/Message";
import SystemMessage from './SystemMessage';
import TextMessage from './TextMessage';
import FileMessage from './FileMessage';
import VoteMessage from './VoteMessage';
import CallMessage from './CallMessage';
import ReplyPreview from './ReplyPreview';
import { MessageService } from '@/src/api/services/MessageService';
import { useUser } from '@/src/contexts/user/UserContext';

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
        handleLongPressMessage,
        handleReaction,
        getAttachmentByMessageId,
        setFullScreenImage,
        selectedChatId,
        previousMessage
    }) => {
    
    const isSender = message.senderId === currentUserId;
    const isFirstInSequence = !previousMessage || previousMessage.senderId !== message.senderId;
    const [actionReaction, setActionReaction] = useState(false);
    const {user} = useUser();
    if (message.type === MessageType.SYSTEM) {
        return <SystemMessage message={message} isHighlighted={isHighlighted} onLayout={onLayout}/>;
    }
  
    const [reactions, setReactions] = useState<any>({});
    useEffect(() => {
        if (message.id) {
            MessageService.getReactions?.(message.id).then(response => {
                if (response.success) {
                    setReactions(response.reactions);
                }
            });
        }
    }, [message.id, currentUserId]);

    const [currentReaction, setCurrentReaction] = useState<string>();
    // lay emoij cua nguoi dung hien tai
    useEffect(() => {
        if (user && user.id) {
            setCurrentReaction(reactions[user.id]);
        }
    }, [reactions, user]);

    const REACTIONS = [
        {id: '1', emoji: '❤️'},     
        {id: '2', emoji: '😊'},      
        {id: '3', emoji: '😢'},      
        {id: '4', emoji: '😮'},    
        {id: '5', emoji: '👍'},     
        {id: '6', emoji: '😆'}, 
    ] as const;

    const handleSelectReaction = (emoji: string) => {
        if (currentReaction === emoji ) {
            // Bỏ chọn reaction
            setReactions(
                (prev: Record<string, any[]>) => {
                    const updated = { ...prev };
                    if (updated[emoji]) {
                        updated[emoji] = updated[emoji].filter(id => id !== currentUserId);
                        if (updated[emoji].length === 0) {
                            delete updated[emoji];
                        }
                    }
                    return updated;
                }
            );
            handleReaction(message.id, "");
        } else{
                // Chọn reaction mới
                setReactions(
                    (prev: Record<string, any[]>) => {
                        const updated = { ...prev };
                        // Tìm emoij truoc do
                        for (const key in updated) {
                            if (updated[key].includes(currentUserId)) {
                                updated[key] = updated[key].filter(id => id !== currentUserId);
                                if (updated[key].length === 0) {
                                    delete updated[key];
                                }
                            }
                        }
                        if (!updated[emoji]) {
                            updated[emoji] = [];
                        }
                        if (!updated[emoji].includes(currentUserId)) {
                            updated[emoji].push(currentUserId);
                        }
                        return updated;
                    }
                );
                handleReaction(message.id, emoji); // Gửi lên server sau
            }
            setActionReaction(false);
    };
    
    if (message.type == MessageType.LEFT_CONVERSATION){
        return (
			<SystemMessage
				message={
					(messageUsers[message.senderId]?.name ||
						"Người dùng không xác định") +
					" đã rời cuộc trò chuyện."
				}
				isHighlighted={isHighlighted}
				onLayout={onLayout}
			/>
		);
    }

    if (message.type === MessageType.JOIN_CONVERSATION) {
        
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

            <View className="flex-col max-w-[70%] relative">
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
                    <View 
                        style={{ minWidth: 80}}
                        className={`relative px-3 py-2 ${
                            isSender
                                ? isHighlighted ? "bg-blue-100" : "bg-gray-100"
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


                        

                    </View>
                    
                </TouchableOpacity>
                {reactions && Object.keys(reactions).length > 0 && (
                    <View className="absolute -bottom-4 flex-row items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-gray-100 mt-1 self-end">
                        <View className="flex-row items-center ">
                            {Object.entries(reactions)
                                .slice(-3)
                                .map(([key, value], index) => (
                                    <Text key={key} className="text-xs">
                                        {REACTIONS.find(reaction => reaction.emoji === key)?.emoji || value as string}
                                    </Text>
                                ))}
                        </View>
                        <View className="bg-gray-50 rounded-full ml-1 px-1">
                            <Text className="text-xs text-gray-600 font-medium">
                                {Object.entries(reactions).length}
                            </Text>
                        </View>
                    </View>
                )}
                <View className={`absolute -bottom-0 ${
                                isSender ? 'right-[100%]' : 'left-[100%]'
                            } bg-white/90 backdrop-blur-sm z-599 rounded-full px-2 py-1 shadow-sm border border-gray-100 self-end flex-row items-center`}>
                    {!actionReaction && (
                        <TouchableOpacity
                            onPress={() => setActionReaction(true)}
                        >
                            <Text className="text-xs text-gray-600 font-medium">
                                <Text style={{ color: '#e5e7eb' }}>{currentReaction ? currentReaction : '🤍'}</Text>
                            </Text>
                        </TouchableOpacity>
                    )}
                    {actionReaction && (
                        <View className="flex-row items-center ml-2">
                            {REACTIONS.map((reaction) => (
                                <TouchableOpacity
                                    key={reaction.id}
                                    onPress={() => handleSelectReaction(reaction.emoji)}
                                    className={`px-1 ${currentReaction === reaction.emoji ? 'bg-blue-100' : ''}`}
                                >
                                    <Text className="text-lg">{reaction.emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default MessageItem;
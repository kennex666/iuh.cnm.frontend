import React, { useEffect, useState } from 'react';
import {Image, Platform, Text, TouchableOpacity, View, Modal, ScrollView} from 'react-native';
import {Message, MessageType} from "@/src/models/Message";
import SystemMessage from './SystemMessage';
import TextMessage from './TextMessage';
import FileMessage from './FileMessage';
import VoteMessage from './VoteMessage';
import CallMessage from './CallMessage';
import ReplyPreview from './ReplyPreview';
import { MessageService } from '@/src/api/services/MessageService';
import { useUser } from '@/src/contexts/user/UserContext';
import {Ionicons} from "@expo/vector-icons";
import { UserService } from '@/src/api/services/UserService';

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
    const [showReactionsModal, setShowReactionsModal] = useState(false);

    if (message.type === MessageType.SYSTEM) {
        return <SystemMessage message={message} isHighlighted={isHighlighted} onLayout={onLayout}/>;
    }
  
    const [reactions, setReactions] = useState<Record<string, string>>({});
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
  setReactions((prev: Record<string, string>) => {
    const updated = { ...prev };

    // Nếu emoji đã được chọn, bỏ chọn
    if (currentReaction === emoji) {
      delete updated[user.id];
      handleReaction(message.id, "");
    } else {
      // Chọn emoji mới
      updated[user.id] = emoji;
      handleReaction(message.id, emoji);
    }

    return updated;
  });

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

    const renderReactionsList = () => {
        if (!reactions) return null;
        
        return (
            <Modal
                visible={showReactionsModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowReactionsModal(false)}
            >
                <TouchableOpacity 
                    className="flex-1 bg-black/50 justify-center items-center"
                    activeOpacity={1}
                    onPress={() => setShowReactionsModal(false)}
                >
                    <View className="bg-white rounded-xl w-80 max-h-96">
                        <View className="p-4 border-b border-gray-100">
                            <Text className="text-lg font-semibold text-center">Reactions</Text>
                        </View>
                        <ScrollView className="p-4">
                            {Object.entries(reactions).map(([userId, emoji]: [string, string]) => {
                                return (
                                  <View
                                    key={userId}
                                    className="flex-row items-center mb-3 p-1 bg-white rounded-lg shadow-sm border border-gray-100"
                                  >
                                    <Text
                                        className="text-xs font-semibold text-gray-800 mr-3 flex-1"
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                    >
                                        {REACTIONS.find((reaction) => reaction.emoji === emoji)?.emoji || emoji}
                                    </Text>
                                    <Text className="text-xs">
                                        {messageUsers[userId]?.name || "Người dùng không xác định"}
                                    </Text>
                                  </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

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
                        className={`relative px-3 py-2 ${Platform.OS != 'web' ? 'h-12' : ''} ${
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
                        {repliedToMessage && (
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
                    <TouchableOpacity 
                        className="absolute -bottom-4 flex-row items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm border border-gray-100 mt-1 self-end"
                        onPress={() => setShowReactionsModal(true)}
                    >
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
                    </TouchableOpacity>
                )}
                {renderReactionsList()}
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
import React from 'react';
import {Platform, ScrollView} from 'react-native';
import {Message} from "@/src/models/Message";
import {Conversation} from "@/src/models/Conversation";
import ChatNewer from "../misc/ChatNewer";
import MessageItem from './MessageItem';
import {findRepliedMessage} from '@/src/utils/messageUtils';

interface MessageListProps {
    scrollViewRef: React.RefObject<ScrollView>;
    messages: Message[];
    messageUsers: { [key: string]: any };
    currentUserId?: string;
    selectedChat: Conversation | null;
    messageRefs: React.MutableRefObject<{ [key: string]: number }>;
    highlightedMessageId: string | null;
    activeReactionId: string | null;
    handleLongPressMessage: (msg: Message) => void;
    handleReactionToggle: (messageId: string) => void;
    handleReaction: (messageId: string, reactionId: string) => void;
    getAttachmentByMessageId: (messageId: string) => Promise<any>;
    setFullScreenImage: (uri: string | null) => void;
    pinnedMessages: Message[];
}

const MessageList: React.FC<MessageListProps> = (
    {
        scrollViewRef,
        messages,
        messageUsers,
        currentUserId,
        selectedChat,
        messageRefs,
        highlightedMessageId,
        activeReactionId,
        handleLongPressMessage,
        handleReactionToggle,
        handleReaction,
        getAttachmentByMessageId,
        setFullScreenImage,
        pinnedMessages
    }) => {
    return (
        <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{paddingBottom: Platform.OS === "web" ? 0 : 80}}
            className={`flex-1 p-4 ${pinnedMessages.length > 0 ? "pt-16" : "pt-4"}`}
        >
            {messages.length === 0 && selectedChat && <ChatNewer selectedChat={selectedChat}/>}

            {messages.map((msg, index) => {
                const onLayout = (event: any) => {
                    const layout = event.nativeEvent.layout;
                    messageRefs.current[msg.id] = layout.y;
                };

                const isHighlighted = msg.id === highlightedMessageId;
                const repliedToMessage = findRepliedMessage(
                    msg.repliedToId || msg.repliedTold,
                    messages
                );
                const previousMessage = index > 0 ? messages[index - 1] : null;

                return (
                    <MessageItem
                        key={msg.id}
                        message={msg}
                        isHighlighted={isHighlighted}
                        messageUsers={messageUsers}
                        currentUserId={currentUserId}
                        onLayout={onLayout}
                        repliedToMessage={repliedToMessage}
                        activeReactionId={activeReactionId}
                        handleLongPressMessage={handleLongPressMessage}
                        handleReactionToggle={handleReactionToggle}
                        handleReaction={handleReaction}
                        getAttachmentByMessageId={getAttachmentByMessageId}
                        setFullScreenImage={setFullScreenImage}
                        selectedChatId={selectedChat?.id || ""}
                        previousMessage={previousMessage}
                    />
                );
            })}
        </ScrollView>
    );
};

export default MessageList;
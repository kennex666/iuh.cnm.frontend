import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {MessageService} from "@/src/api/services/MessageService";
import {Conversation} from "@/src/models/Conversation";
import SocketService from "@/src/api/services/SocketService";
import { useUser } from "@/src/contexts/user/UserContext";
import { UserService } from "@/src/api/services/UserService";

interface ChatHeaderProps {
    selectedChat: Conversation;
    onBackPress?: () => void;
    onInfoPress?: () => void;
    information?: any;
}

export default function ChatHeader({
                                       selectedChat,
                                       onBackPress,
                                       onInfoPress,
                                       information,
                                   }: ChatHeaderProps) {
    {
        const [groups, setGroups] = useState<Conversation | null>(selectedChat);
        const [avatarUrl, setAvatarUrl] = useState<string>('https://example.com/default-avatar.png');
        useEffect(() => {
            const handleAddParticipant = (updatedConversation: Conversation) => {
                setGroups(updatedConversation);
            };

            const handleConversationRenamed = (data: { conversationId: string, newName: string }) => {
                if (selectedChat.id === data.conversationId) {
                    setGroups(prev => prev ? { ...prev, name: data.newName } : prev);
                }
            };

            const getConversationAvatar = async (conversation: Conversation) => {
                if (!conversation.isGroup && conversation.participantIds.length < 3) {
                    const otherParticipantId = conversation.participantIds.find((id) => id !== user?.id);
                    const otherParticipant = await UserService.getUserById(otherParticipantId || '');
                    if (otherParticipant.success && otherParticipant.user) {
                        // return otherParticipant.user.avatarURL || 'https://example.com/default-avatar.png';
                        setAvatarUrl(otherParticipant.user.avatarURL || 'https://example.com/default-avatar.png');
                    }
                } else {
                    // return conversation.avatarUrl;
                    setAvatarUrl(conversation.avatarUrl || 'https://example.com/default-avatar.png');
                }
            };
            getConversationAvatar(selectedChat);
            
            const socketService = SocketService.getInstance();
            socketService.onParticipantsAddedServer(handleAddParticipant);
            socketService.onConversationRenamed(handleConversationRenamed);
            return () => {
                socketService.removeParticipantsAddedServer(handleAddParticipant);
                socketService.removeConversationRenamedListener(handleConversationRenamed);
            };
        }, [selectedChat]);

        const {user} = useUser();

        const name = groups?.isGroup 
            ? groups?.name 
            : groups?.participantInfo && groups.participantInfo.length > 0 
                ? groups.participantInfo.find(p => p.id !== user?.id)?.name || "Người dùng"
                : "Người dùng";
        const avatar = groups?.isGroup 
            ? groups?.avatarUrl 
            : groups?.participantInfo && groups.participantInfo.length > 0 
                ? groups.participantInfo.find(p => p.id !== user?.id)?.avatar
                : null;

        

        return (
            <View className="h-14 px-3 border-b border-gray-200 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {onBackPress && (
                        <TouchableOpacity onPress={onBackPress} className="mr-2">
                            <MaterialCommunityIcons name="chevron-left" size={28} color="#0084ff"/>
                        </TouchableOpacity>
                    )}
                    <Image
                        source={{uri: avatarUrl || "https://picsum.photos/200"}}
                        className="w-10 h-10 rounded-full"
                    />
                    <View className="ml-2.5" style={{maxWidth: "45%"}}>
                        <Text
                            className="font-semibold text-gray-900"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {name}
                        </Text>
                        {groups?.isGroup && (
                            <Text className="text-xs text-gray-500">
                                {groups?.participantIds.length} thành viên
                            </Text>
                        )}
                    </View>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity
                        className="p-2"
                        onPress={() => {
                            MessageService.makeACall(selectedChat.id);
                        }}
                    >
                        <MaterialCommunityIcons name="phone" size={22} color="#0084ff"/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            MessageService.makeACall(selectedChat.id);
                        }}
                        className="p-2 mx-1"
                    >
                        <MaterialCommunityIcons name="video" size={24} color="#0084ff"/>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2" onPress={onInfoPress}>
                        <MaterialCommunityIcons
                            name="dots-horizontal"
                            size={24}
                            color="#0084ff"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

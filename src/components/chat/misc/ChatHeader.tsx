import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import React, {useEffect, useState} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {MessageService} from "@/src/api/services/MessageService";
import {Conversation} from "@/src/models/Conversation";
import SocketService from "@/src/api/services/SocketService";

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
        useEffect(() => {
            const handleAddParticipant = (updatedConversation: Conversation) => {
                console.log("Add participant event received:", updatedConversation);
                setGroups(updatedConversation);
            };
            const socketService = SocketService.getInstance();
            socketService.onParticipantsAddedServer(handleAddParticipant);
            return () => {
                socketService.removeParticipantsAddedServer(handleAddParticipant);
            };
        }, [selectedChat]);

        const name = groups?.isGroup ? groups?.name : groups?.participantInfo[0].name;
        const avatar = groups?.isGroup ? groups?.avatarUrl : groups?.participantInfo[0].avatar;

        return (
            <View className="h-14 px-3 border-b border-gray-200 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {onBackPress && (
                        <TouchableOpacity onPress={onBackPress} className="mr-2">
                            <MaterialCommunityIcons name="chevron-left" size={28} color="#0084ff"/>
                        </TouchableOpacity>
                    )}
                    <Image
                        source={{uri: avatar?.trim() || "https://picsum.photos/200"}}
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

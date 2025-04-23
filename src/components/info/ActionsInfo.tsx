import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddMemberModal from './AddMemberModal';
import { FriendRequestService } from '@/src/api/services/FriendRequestService';
import FriendRequest from '@/src/models/FriendRequest';
import { User } from '@/src/models/User';
import { UserService } from '@/src/api/services/UserService';
import { useUser } from '@/src/contexts/user/UserContext';
import { Conversation } from '@/src/models/Conversation';
import { ConversationService } from '@/src/api/services/ConversationService';

interface ActionsInfoProps {
    selectChat: Conversation | null;
    setLoadConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
    onSearchPress: () => void;
}
export default function ActionsInfo({ selectChat, setLoadConversation, onSearchPress }: ActionsInfoProps) {
    const [addMemberVisible, setAddMemberVisible] = useState(false);

    const fetchConversation = async (conversationId: string) => {
        try {
            const conversation = await ConversationService.getConversationById(conversationId);
            setLoadConversation(conversation.conversation);
        }
        catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    useEffect(() => {
        fetchConversation(selectChat?.id || '');
    }
    , [addMemberVisible]);
    
    return (
        <View className={`flex-row justify-around items-center pt-6 pb-4 border-b-4 border-gray-200`}>
            {/* Actions chung */}
            <TouchableOpacity className="items-center">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="notifications-off-outline" size={18} color="#3B82F6" />
                </View>
                <Text className="text-xs text-blue-900">Tắt thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={onSearchPress}>
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="search-outline" size={18} color="#3B82F6" />
                </View>
                <Text className="text-xs text-blue-900">Tìm kiếm</Text>
            </TouchableOpacity>

            {(selectChat?.isGroup) ? (
                <TouchableOpacity className="items-center"
                    onPress={() => {setAddMemberVisible(true); fetchConversation(selectChat.id);}}>
                    <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="people-outline" size={18} color="#3B82F6" />
                    </View>
                    <Text className="text-xs text-blue-900">Thêm member</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="items-center">
                    <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="person-outline" size={18} color="#3B82F6" />
                    </View>
                    <Text className="text-xs text-blue-900">Xem profile</Text>
                </TouchableOpacity>
            )}
            {addMemberVisible && ( <AddMemberModal visible={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
        selectChat={selectChat}/> )}
        </View>
    );
} 
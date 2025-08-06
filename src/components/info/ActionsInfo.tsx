import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AddMemberModal from './AddMemberModal';
import {Conversation} from '@/src/models/Conversation';
import {ConversationService} from '@/src/api/services/ConversationService';

interface ActionsInfoProps {
    selectChat: Conversation | null;
    setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
    onSearchPress: () => void;
}

export default function ActionsInfo({selectChat, setConversation, onSearchPress}: ActionsInfoProps) {
    const [addMemberVisible, setAddMemberVisible] = useState(false);

    const fetchConversation = async (conversationId: string) => {
        try {
            const conversation = await ConversationService.getConversationById(conversationId);
            setConversation(conversation.conversation);
        } catch (error) {
            console.error('Error fetching conversation:', error);
        }
    };

    useEffect(() => {
            fetchConversation(selectChat?.id || '');
        }
    ,[addMemberVisible]);

    return (
        <View className={`flex-row justify-around items-center pt-6 pb-4 border-b-4 border-gray-200`}>
            {/* Actions chung */}
            <TouchableOpacity className="items-center">
                <View
                    className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="notifications-off-outline" size={18} color="#3B82F6"/>
                </View>
                <Text className="text-xs text-blue-900">Tắt thông báo</Text>
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={onSearchPress}>
                <View
                    className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                    <Ionicons name="search-outline" size={18} color="#3B82F6"/>
                </View>
                <Text className="text-xs text-blue-900">Tìm kiếm</Text>
            </TouchableOpacity>

            {(selectChat?.isGroup) ? (
                <TouchableOpacity className="items-center"
                                  onPress={() => {
                                      setAddMemberVisible(true);
                                      fetchConversation(selectChat.id);
                                  }}>
                    <View
                        className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="people-outline" size={18} color="#3B82F6"/>
                    </View>
                    <Text className="text-xs text-blue-900">Thêm member</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity className="items-center">
                    <View
                        className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="person-outline" size={18} color="#3B82F6"/>
                    </View>
                    <Text className="text-xs text-blue-900">Xem profile</Text>
                </TouchableOpacity>
            )}
            {addMemberVisible && (<AddMemberModal visible={addMemberVisible}
                                                  onClose={() => setAddMemberVisible(false)}
                                                  selectChat={selectChat}/>)}
        </View>
    );
} 
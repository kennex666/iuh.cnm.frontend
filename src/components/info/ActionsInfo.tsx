import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddMemberModal from './AddMemberModal';

// Mock data cho người dùng có thể thêm vào nhóm
const MOCK_USERS = [
    {
      id: '8',
      name: 'Nguyễn Văn A',
      avatar: 'https://placehold.co/96x96/png',
      isOnline: true,
      mutualFriends: 5
    },
    {
      id: '9',
      name: 'Trần Thị B',
      avatar: 'https://placehold.co/96x96/png',
      isOnline: false,
      mutualFriends: 3
    },
    {
      id: '10',
      name: 'Lê Văn C',
      avatar: 'https://placehold.co/96x96/png',
      isOnline: true,
      mutualFriends: 8
    },
    {
      id: '11',
      name: 'Phạm Thị D',
      avatar: 'https://placehold.co/96x96/png',
      isOnline: false,
      mutualFriends: 2
    }
  ];
  

interface ActionsInfoProps {
    isGroup: boolean;
    onSearchPress: () => void;
}

export default function ActionsInfo({ isGroup, onSearchPress }: ActionsInfoProps) {
    const [addMemberVisible, setAddMemberVisible] = useState(false);
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

            {isGroup ? (
                <TouchableOpacity className="items-center"
                    onPress={() => setAddMemberVisible(true)}>
                    <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center mb-1.5 shadow-sm active:bg-blue-100">
                        <Ionicons name="people-outline" size={18} color="#3B82F6" />
                    </View>
                    <Text className="text-xs text-blue-900">Thêm s viên</Text>
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
        MOCK_USERS={MOCK_USERS}/> )}
        </View>
    );
} 
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWindowDimensions } from 'react-native';
import { User } from '@/src/models/User';
import { ConversationService } from '@/src/api/services/ConversationService';
import { Conversation } from '@/src/models/Conversation';

interface AddMemberModalProps {
    visible: boolean;
    onClose: () => void;
    selectChat: Conversation | null;
    MOCK_USERS: User[];
}

export default function AddMemberModal ({ visible, onClose, selectChat ,MOCK_USERS }: AddMemberModalProps) {
    const isDesktop = useWindowDimensions().width >= 768;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
    const toggleUserSelection = (userId: string) => {
      setSelectedUsers(prev =>
        prev.includes(userId)
          ? prev.filter(id => id !== userId)
          : [...prev, userId]
      );
    };
  
    const filteredUsers = MOCK_USERS.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMembers = async () => {
      // Handle adding members logic here
      console.log('Selected users:', selectedUsers);
      console.log('Selected chat:', selectChat);
      try {
        if (!selectChat?.id) {
          console.error('Conversation ID is undefined');
          return;
        }
        const response = await ConversationService.addParticipants(selectChat.id, selectedUsers);
        if (!response.success) {
          console.error('Failed to add members:', response.message);
          return;
        }

        console.log('Members added successfully!');
      }
      catch (error) {
        console.error('Error adding members:', error);
      }
      onClose(); // Close the modal after adding members
    }
  
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/30 items-center">
          {/* Container cho desktop */}
          <View style={[
            {
              width: isDesktop ? 400 : '100%',
              height: isDesktop ? 480 : '100%',
              borderRadius: isDesktop ? 16 : 0,
              overflow: 'hidden',
              marginTop: isDesktop ? 100 : 0
            }
          ]}>
            {/* Content container */}
            <View style={[
              {
                flex: 1,
                backgroundColor: 'white',
                marginTop: isDesktop ? 0 : 64,
                borderTopLeftRadius: isDesktop ? 0 : 24,
                borderTopRightRadius: isDesktop ? 0 : 24
              }
            ]}>
              {/* Header */}
              <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Thêm thành viên</Text>
                <TouchableOpacity
                  className={`py-1 px-3 rounded-lg ${selectedUsers.length > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}
                  disabled={selectedUsers.length === 0}
                  onPress={handleAddMembers}
                >
                  <Text className={selectedUsers.length > 0 ? 'text-white' : 'text-gray-500'}>
                    Thêm ({selectedUsers.length})
                  </Text>
                </TouchableOpacity>
              </View>
  
              {/* Search Bar */}
              <View className="px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                  <Ionicons name="search" size={20} color="#666" />
                  <TextInput
                    className="flex-1 ml-2 text-base"
                    placeholder="Tìm kiếm bạn bè"
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
              </View>
  
              {/* User List */}
              <ScrollView className="flex-1 px-4">
                {filteredUsers.map(user => (
                  <TouchableOpacity
                    key={user.id}
                    className="flex-row items-center py-3 hover:bg-gray-50 active:bg-gray-100"
                    onPress={() => toggleUserSelection(user.id)}
                  >
                    <View className="relative">
                      <Image
                        source={{ uri: user.avatarURL || 'https://placehold.co/400' }}
                        className="w-12 h-12 rounded-full"
                      />
                      {user.isOnline && (
                        <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="text-[15px] font-medium text-gray-900">{user.name}</Text>
                    </View>
                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center
                      ${selectedUsers.includes(user.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-300'}`}
                    >
                      {selectedUsers.includes(user.id) && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
                {/* Padding bottom for better scrolling */}
                <View className="h-4" />
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

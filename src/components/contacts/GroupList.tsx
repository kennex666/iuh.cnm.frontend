import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CreateGroup from './CreateGroup';
import { ConversationService } from '@/src/api/services/ConversationService';
import { Conversation } from '@/src/models/Conversation';

export default function GroupList() {

    const [isCreateGroupVisible, setIsCreateGroupVisible] = useState(false);
    const [groups, setGroups] = useState<Conversation[]>([]);

    useEffect(() => {
        // Fetch groups from API or database here
        const fetchGroups = async () => {
            try {
                const response = await ConversationService.getConversations();
                for(const group of response.conversations) {
                    if(group.isGroup || group.participantIds.length > 2) {
                        setGroups(prevGroups => [...prevGroups, group]);
                    }
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        }
        fetchGroups();
    }, []);

    return (
        <View className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-800"
                        placeholder="Tìm nhóm..."
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Create Group Button */}
            <TouchableOpacity 
                className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-blue-50"
                onPress={() => setIsCreateGroupVisible(true)}
            >
                <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center">
                    <Ionicons name="add" size={24} color="white" />
                </View>
                <Text className="ml-3 text-blue-500 font-medium">Tạo nhóm mới</Text>
            </TouchableOpacity>

            {/* Groups List */}
            <ScrollView className="flex-1">
                {groups.map((group, index) => (
                    <TouchableOpacity
                        key={group.id || `group-${index}`}
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    >
                        <Image
                            source={{ uri: group.avatarUrl || 'https://placehold.co/400' }}
                            resizeMode="cover"
                            className="w-12 h-12 rounded-full"
                        />
                        <View className="flex-1 ml-3">
                            <Text className="text-base font-medium text-gray-800">
                                {group.name || 'No Name'}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                {group.participantIds.length} thành viên • 
                            </Text>
                        </View>
                        <TouchableOpacity className="p-2">
                            <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Create Group Modal */}
            <CreateGroup 
                visible={isCreateGroupVisible}
                onClose={() => setIsCreateGroupVisible(false)}
            />
        </View>
    );
} 
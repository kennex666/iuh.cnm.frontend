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

interface ActionsInfoProps {
    selectChat: Conversation | null;
    onSearchPress: () => void;
}

export default function ActionsInfo({ selectChat, onSearchPress }: ActionsInfoProps) {
    const [addMemberVisible, setAddMemberVisible] = useState(false);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const {user} = useUser(); 
    const [contacts, setContacts] = useState<User[]>([]);
    useEffect(() => {
            // Fetch contacts from API or database here
            const fetchFriendRequests = async () => {
                try {
                    // Simulate fetching contacts
                    const response = await FriendRequestService.getAllAcceptedFriendRequests("");
                    console.log('Fetched friend requests 12122:', response);
                    setFriendRequests(response.friendRequests || []); 
                } catch (error) {
                    setFriendRequests([]);
                    console.error('Error fetching friend requests:', error);
                }
            };
    
            fetchFriendRequests();
    }, []);
    
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const ids = [];
                for (const request of friendRequests) {
                    if (request.senderId !== user?.id) {
                        ids.push(request.senderId);
                    } else {
                        ids.push(request.receiverId);
                    }
                }
        
                    const uniqueIds = Array.from(new Set(ids)); 
                    const contactsList = [] as User[];
                    for (const id of uniqueIds) {
                        const response = await UserService.getUserById(id);
                        if (response.success && !selectChat?.participantIds.includes(id)) {
                            contactsList.push(response.user as User);
                        }
                    }
                    setContacts(contactsList);
                } catch (error) {
                    setContacts([]);
                    console.error('Error fetching contacts:', error);
                }
            };
            if (Array.isArray(friendRequests) && friendRequests.length > 0) {
                fetchContacts();
            }
    }, [friendRequests]);
    
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

            {selectChat?.isGroup ? (
                <TouchableOpacity className="items-center"
                    onPress={() => setAddMemberVisible(true)}>
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
        selectChat={selectChat}
        MOCK_USERS={contacts}/> )}
        </View>
    );
} 
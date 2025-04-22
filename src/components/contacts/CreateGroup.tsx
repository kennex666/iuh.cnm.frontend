import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestService } from '@/src/api/services/FriendRequestService';
import { UserService } from '@/src/api/services/UserService';
import { User } from '@/src/models/User';
import FriendRequest from '@/src/models/FriendRequest';
import { ConversationService } from '@/src/api/services/ConversationService';
import {Conversation} from '@/src/models/Conversation';
import Toast from '../ui/Toast';

interface CreateGroupProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreateGroup({ visible, onClose }: CreateGroupProps) {
    const windowWidth = Dimensions.get('window').width; 
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [contacts, setContacts] = useState([] as User[]);
    const [friendRequests, setFriendRequests] = useState([] as FriendRequest[]);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
    const [toast, setToast] = useState({
            visible: false,
            message: '',
            type: 'success' as 'success' | 'error'
    });

    const toggleContact = (contactId: string) => {
        setSelectedContacts(prev => 
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    useEffect(() => {
        // Fetch contacts from API or database here
        const fetchFriendRequests = async () => {
            try {
                // Simulate fetching contacts
                const response = await FriendRequestService.getAllAcceptedFriendRequests("");
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
                const contactsList = [] as User[];
                for (const request of friendRequests) {
                    const response = await UserService.getUserById(request.senderId);
                    if (response.success) {
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

    const handleCreateGroup = async () => {
        if (groupName.trim() === '' || selectedContacts.length === 0) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập tên nhóm và chọn ít nhất 2 thành viên',
                type: 'error'
            });
            return;
        }
        try {
            if( selectedContacts.length < 2) {
                setToast({
                    visible: true,
                    message: 'Chọn ít nhất 2 thành viên',
                    type: 'error'
                });
                return;
            }
            const newConversation: Conversation = {
                name: groupName,
                participants: selectedContacts,
                isGroup: true,
                avatar: '', 
                adminIds: [], 
                settings: {}, 
                createdAt: new Date().toISOString(), 
                updatedAt: new Date().toISOString(), 
            };
            const response = await ConversationService.createConversation(newConversation);
            if (response.success) {
                console.log('Group created successfully:', response.conversation);
                onClose(); // Close the modal after creating the group
            } else {
                console.error('Error creating group:', response.message);
            }
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
        >
            <View className={`flex-1 bg-black/30 items-center justify-center ${windowWidth > 768 ? '' : 'mt-12'}`}>
                <View className="w-full md:w-1/3 md:max-w-[90%] md:rounded-2xl md:max-h-[90%] h-full md:h-auto bg-white overflow-hidden">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        <Text className="text-lg font-semibold">Tạo nhóm</Text>
                        <TouchableOpacity 
                            className={`px-4 py-2 rounded-full ${selectedContacts.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                            disabled={selectedContacts.length === 0}
                            onPress={() => handleCreateGroup()}
                        >
                            <Text className="text-white font-medium">Tạo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Group Info Section */}
                    <View className="px-4 py-4 border-b border-gray-200">
                        <View className="flex-row items-center">
                            {/* Avatar Selection */}
                            <TouchableOpacity className="relative">
                                <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
                                    <Ionicons name="camera" size={24} color="#666" />
                                </View>
                            </TouchableOpacity>
                            {/* Group Name Input */}
                            <View className="flex-1 ml-3">
                                <TextInput
                                    className="text-base border-b border-gray-200 pb-2"
                                    placeholder="Nhập tên nhóm..."
                                    value={groupName}
                                    onChangeText={setGroupName}
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Search Bar */}
                    <View className="px-4 py-2 border-b border-gray-200">
                        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
                            <Ionicons name="search" size={20} color="#666" />
                            <TextInput
                                className="flex-1 ml-2 text-base"
                                placeholder="Nhập tên, số điện thoại, hoặc danh sách số điện thoại"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholderTextColor="#666"
                            />
                        </View>
                    </View>

                    {/* Contacts List */}
                    <ScrollView className="flex-1">
                        {contacts.map(contact => (
                            <TouchableOpacity
                                key={contact.id}
                                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                                onPress={() => toggleContact(contact.id)}
                            >
                                <Image
                                    source={{ uri: contact.avatarURL || 'https://placehold.co/400' }}
                                    resizeMode="cover"
                                    className="w-12 h-12 rounded-full"
                                />
                                <Text className="flex-1 ml-3 text-base">{contact.name}</Text>
                                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedContacts.includes(contact.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-200'}`}>
                                    {selectedContacts.includes(contact.id) && (
                                        <Ionicons name="checkmark" size={16} color="white" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({...prev, visible: false}))}
            />
        </Modal>
    );
} 
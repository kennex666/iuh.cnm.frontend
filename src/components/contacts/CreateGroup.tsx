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
    Alert,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FriendRequestService } from '@/src/api/services/FriendRequestService';
import { UserService } from '@/src/api/services/UserService';
import { User } from '@/src/models/User';
import FriendRequest from '@/src/models/FriendRequest';
import { ConversationService } from '@/src/api/services/ConversationService';
import {Conversation} from '@/src/models/Conversation';
import Toast from '../ui/Toast';
import { UserProvider, useUser } from '@/src/contexts/user/UserContext';
import * as ImagePicker from 'expo-image-picker';
import SocketService from '@/src/api/services/SocketService';

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
    const [groupAvatar, setGroupAvatar] = useState('');
    const [toast, setToast] = useState({
            visible: false,
            message: '',
            type: 'success' as 'success' | 'error'
    }); // Assuming you have a way to get the current user's ID
    const { user } = useUser(); // Assuming you have a way to get the current user's ID

    const toggleContact = (contactId: string) => {
        setSelectedContacts(prev => 
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    const pickImage = async () => {
        try {
            if (Platform.OS === 'web') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (event: any) => {
                    const file = event.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            setGroupAvatar(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            } else {
                Alert.alert(
                    'Chọn ảnh',
                    'Bạn có muốn chọn ảnh từ thư viện không?',
                    [
                        {
                            text: 'Không',
                            style: 'cancel',
                        },
                        {
                            text: 'Có',
                            onPress: async () => {
                                try {
                                    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

                                    if (!permissionResult.granted) {
                                        alert('Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này!');
                                        return;
                                    }

                                    const result = await ImagePicker.launchImageLibraryAsync({
                                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                        allowsEditing: true,
                                        aspect: [1, 1],
                                        quality: 1,
                                    });

                                    if (!result.canceled) {
                                        console.log('Selected Image:', result.assets[0].uri);
                                        setGroupAvatar(result.assets[0].uri);
                                    }
                                } catch (error) {
                                    console.error('Error picking image:', error);
                                    alert('Đã xảy ra lỗi khi chọn ảnh. Vui lòng thử lại.');
                                }
                            },
                        },
                    ],
                    { cancelable: true }
                );
            }
        } catch (error) {
            console.error('Error picking image:', error);
            alert('Đã xảy ra lỗi khi chọn ảnh. Vui lòng thử lại.');
        }
    };

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
    
                const uniqueIds = Array.from(new Set(ids)); // Loại bỏ trùng lặp
                const contactsList = [] as User[];
                for (const id of uniqueIds) {
                    const response = await UserService.getUserById(id);
                    if (response.success) {
                        contactsList.push(response.user as User);
                    }
                }
                console.log('Fetched contacts:', contactsList);
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
                id: '',
                isGroup: true,
                name: groupName,
                avatarUrl: groupAvatar ? groupAvatar : 'https://placehold.co/400',
                avatarGroup: '',
                type: 'group',
                participantIds: [user?.id ?? '', ...selectedContacts].filter(id => id !== ''),
                participantInfo: [user?.id ?? '', ...selectedContacts]
                    .filter(id => id !== '')
                    .map(id => ({
                    id,
                    name: contacts.find(contact => contact.id === id)?.name || '',
                    avatar: contacts.find(contact => contact.id === id)?.avatarURL || '',
                    nickname: '',
                    role: id === user?.id ? 'admin' : 'member',
                })),
                url: `${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`,
                pinMessages: [],
                settings: {
                    isReviewNewParticipant: false,
                    isAllowReadNewMessage: true,
                    isAllowMessaging: true,
                    pendingList: [],
                },
                lastMessage: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            console.log('Creating group with data:', newConversation);
            const response = await ConversationService.createConversation(newConversation);
            const socketService = SocketService.getInstance();
            if (!response.success) {
                setToast({
                    visible: true,
                    message: "Group creation failed",
                    type: 'error'
                });
                return;
            }
            socketService.actionParticipantsAdded({conversationId: response.conversation.id, participantIds: response.conversation.participantIds});
            if (response.success) {
                console.log('Group created successfully:', response.conversation);
                onClose(); // Close the modal after creating the group
            } else {
                console.error('Error creating group:', response.message);
            }
            onClose(); 
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
                            onPress={handleCreateGroup}
                        >
                            <Text className="text-white font-medium">Tạo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Group Info Section */}
                    <View className="px-4 py-4 border-b border-gray-200">
                        <View className="flex-row items-center">
                            {/* Avatar Selection */}
                            <TouchableOpacity className="relative" onPress={pickImage}>
                                <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center">
                                    {groupAvatar ? (
                                        <Image
                                            source={{ uri: groupAvatar }}
                                            resizeMode="cover"
                                            className="w-14 h-14 rounded-full"
                                        />
                                    ) : (
                                        <Ionicons name="camera" size={24} color="#666" />
                                    )}
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
                        {contacts.map((contact, index) => (
                            <TouchableOpacity
                                key={`${contact.id}-${index}`} 
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
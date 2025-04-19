import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CreateGroupProps {
    visible: boolean;
    onClose: () => void;
}

export default function CreateGroup({ visible, onClose }: CreateGroupProps) {
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data for contacts
    const contacts = [
        { id: '1', name: 'Nguyễn Văn A', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png' },
        { id: '2', name: 'Trần Thị B', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png' },
        { id: '3', name: 'Lê Văn C', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png' },
        { id: '4', name: 'Phạm Thị D', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png' },
    ];

    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const toggleContact = (contactId: string) => {
        setSelectedContacts(prev => 
            prev.includes(contactId)
                ? prev.filter(id => id !== contactId)
                : [...prev, contactId]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
        >
            <View className="flex-1 bg-white">
                {/* Header */}
                <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold">Tạo nhóm</Text>
                    <TouchableOpacity 
                        className={`px-4 py-2 rounded-full ${selectedContacts.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
                        disabled={selectedContacts.length === 0}
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
                <View className="px-4 py-2">
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
                                source={{ uri: contact.avatarUrl }}
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
        </Modal>
    );
} 
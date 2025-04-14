import React from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ContactList() {
    // Mock data for UI demonstration
    const contacts = [
        { id: '1', name: 'Ái Duy', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: true },
        { id: '2', name: 'An Khương Nguyễn', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: false },
        { id: '3', name: 'Anh Thư', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: true },
        { id: '4', name: 'Bảo Phúc', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: false },
        { id: '5', name: 'Bảo Phụng', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: true },
        { id: '6', name: 'Bảo Trọng', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: false },
        { id: '7', name: 'Bình', avatarUrl: 'https://placehold.co/40x40/0068FF/FFFFFF/png', isOnline: true },
    ];

    // Group contacts by first letter
    const groupedContacts = contacts.reduce((groups: { [key: string]: typeof contacts }, contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
        return groups;
    }, {});

    // Sort groups alphabetically
    const sortedGroups = Object.keys(groupedContacts).sort();

    return (
        <View className="flex-1 bg-white">
            {/* Search Bar */}
            <View className="px-4 py-2 border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <Ionicons name="search" size={20} color="#666" />
                    <TextInput
                        className="flex-1 ml-2 text-base text-gray-800"
                        placeholder="Tìm bạn bè..."
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* Contacts List */}
            <ScrollView className="flex-1">
                {sortedGroups.map(letter => (
                    <View key={letter}>
                        {/* Section Header */}
                        <View className="px-4 py-2 bg-gray-50">
                            <Text className="text-sm font-semibold text-gray-500">{letter}</Text>
                        </View>

                        {/* Contact Items */}
                        {groupedContacts[letter].map(contact => (
                            <TouchableOpacity
                                key={contact.id}
                                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                            >
                                <Image
                                    source={{ uri: contact.avatarUrl }}
                                    className="w-12 h-12 rounded-full"
                                />
                                <View className="flex-1 ml-3">
                                    <Text className="text-base font-medium text-gray-800">
                                        {contact.name}
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        {contact.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                                    </Text>
                                </View>
                                <TouchableOpacity className="p-2">
                                    <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
} 
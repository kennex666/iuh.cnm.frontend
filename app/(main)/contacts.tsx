import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import ContactList from '@/src/components/contacts/ContactList';
import FriendRequestList from '@/src/components/contacts/FriendRequestList';

export default function ContactsScreen() {
    const [activeTab, setActiveTab] = useState('contacts');

    return (
        <View className="flex-1 bg-white">
            {/* Tab Bar */}
            <View className="flex-row border-b border-gray-200">
                <TouchableOpacity
                    className={`flex-1 py-3 ${activeTab === 'contacts' ? 'border-b-2 border-blue-500' : ''}`}
                    onPress={() => setActiveTab('contacts')}
                >
                    <Text 
                        className={`text-center font-medium ${
                            activeTab === 'contacts' ? 'text-blue-500' : 'text-gray-500'
                        }`}
                    >
                        Danh bạ
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-3 ${activeTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
                    onPress={() => setActiveTab('requests')}
                >
                    <Text 
                        className={`text-center font-medium ${
                            activeTab === 'requests' ? 'text-blue-500' : 'text-gray-500'
                        }`}
                    >
                        Lời mời kết bạn
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="flex-1">
                {activeTab === 'contacts' ? <ContactList /> : <FriendRequestList />}
            </View>
        </View>
    );
}


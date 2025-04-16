import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import ContactList from '@/src/components/contacts/ContactList';
import FriendRequestList from '@/src/components/contacts/FriendRequestList';
import GroupList from '@/src/components/contacts/GroupList';
import GroupRequestList from '@/src/components/contacts/GroupRequestList';

export default function ContactsScreen() {
    const [activeTab, setActiveTab] = useState('contacts');

    const renderContent = () => {
        switch (activeTab) {
            case 'contacts':
                return <ContactList />;
            case 'requests':
                return <FriendRequestList />;
            case 'groups':
                return <GroupList />;
            case 'groupRequests':
                return <GroupRequestList />;
            default:
                return <ContactList />;
        }
    };

    return (
        <View className="flex-1 bg-white mt-12">
            {/* Tab Bar */}
            <View className="border-b border-gray-200 bg-white">
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    className="px-2"
                >
                    <TouchableOpacity
                        className={`py-4 px-6 ${
                            activeTab === 'contacts' 
                            ? 'border-b-2 border-blue-500' 
                            : 'border-b-2 border-transparent'
                        }`}
                        onPress={() => setActiveTab('contacts')}
                    >
                        <Text 
                            className={`text-[16px] font-semibold ${
                                activeTab === 'contacts' ? 'text-blue-500' : 'text-gray-600'
                            }`}
                        >
                            Danh bạ
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-4 px-6 ${
                            activeTab === 'requests' 
                            ? 'border-b-2 border-blue-500' 
                            : 'border-b-2 border-transparent'
                        }`}
                        onPress={() => setActiveTab('requests')}
                    >
                        <Text 
                            className={`text-[16px] font-semibold ${
                                activeTab === 'requests' ? 'text-blue-500' : 'text-gray-600'
                            }`}
                        >
                            Lời mời kết bạn
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-4 px-6 ${
                            activeTab === 'groups' 
                            ? 'border-b-2 border-blue-500' 
                            : 'border-b-2 border-transparent'
                        }`}
                        onPress={() => setActiveTab('groups')}
                    >
                        <Text 
                            className={`text-[16px] font-semibold ${
                                activeTab === 'groups' ? 'text-blue-500' : 'text-gray-600'
                            }`}
                        >
                            Nhóm
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-4 px-6 ${
                            activeTab === 'groupRequests' 
                            ? 'border-b-2 border-blue-500' 
                            : 'border-b-2 border-transparent'
                        }`}
                        onPress={() => setActiveTab('groupRequests')}
                    >
                        <Text 
                            className={`text-[16px] font-semibold ${
                                activeTab === 'groupRequests' ? 'text-blue-500' : 'text-gray-600'
                            }`}
                        >
                            Lời mời nhóm
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Content */}
            <View className="flex-1">
                {renderContent()}
            </View>
        </View>
    );
}


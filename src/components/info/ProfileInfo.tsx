import { useUser } from '@/src/contexts/user/UserContext';
import { Conversation } from '@/src/models/Conversation';
import React from 'react';
import {Image, Text, View} from 'react-native';

interface ProfileInfoProps {
    conversation: Conversation | null;
}

export default function ProfileInfo({conversation}: ProfileInfoProps) {
    // listen to socket events to update online status
    const {user} = useUser();

    const name = conversation?.isGroup 
        ? conversation?.name 
        : conversation?.participantInfo && conversation.participantInfo.length > 0 
        ? conversation.participantInfo.find(p => p.id !== user?.id)?.name || "Người dùng"
            : "Người dùng";
    const isGroup = conversation?.isGroup || false;
    const isOnline = conversation?.participantInfo?.some(p => p.id !== user?.id && p.isOnline) || false;
    const memberCount = conversation?.participantInfo?.length || 0;
    const avatar = conversation?.isGroup 
        ? conversation?.avatarUrl 
        : conversation?.participantInfo && conversation.participantInfo.length > 0 
        ? conversation.participantInfo.find(p => p.id !== user?.id)?.avatar
        : null;
    return (
        <View className="items-center pt-8 pb-6 border-b-4 border-gray-200">
            <View className="mb-4 relative">
                <View
                    className="w-24 h-24 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 items-center justify-center">
                    <Image
                        source={{uri: avatar || 'https://placehold.co/96x96/png'}}
                        className="w-24 h-24 rounded-full border-[2.5px] border-white"
                    />
                </View>
                {!isGroup && isOnline && (
                    <View
                        className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-[2.5px] border-white shadow-sm"/>
                )}
            </View>
            <Text className="text-[17px] font-semibold text-blue-950">
                {name }
            </Text>
            <Text className="text-sm text-blue-500 mt-1">
                {isGroup
                    ? `${memberCount || 0} thành viên`
                    : isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </Text>
        </View>
    );
} 
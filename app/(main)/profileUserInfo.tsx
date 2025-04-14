import React from "react";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import CoverImage from "@/src/components/profile/CoverImage";
import AvatarImage from "@/src/components/profile/AvatarImage";
import ProfileInfoItem from "@/src/components/profile/ProfileInfoItem";
import ModalHeader from "@/src/components/profile/ModelHeader";
import {formatDate} from "@/src/utils/DateTime";
import {User} from "@/src/models/User";

type ProfileInfoProps = {
    user: Partial<User> | null;
    avatarSource: { uri: string | undefined };
    coverSource: { uri: string | undefined };
    onPickAvatar: () => Promise<void>;
    onPickCover: () => Promise<void>;
    onEditPress: () => void;
    onClose: () => void;
};

const genderMap = {
    "male": "Nam",
    "female": "Nữ",
    "other": "Khác"
}

export default function ProfileUserInfo({
                                            user,
                                            avatarSource,
                                            coverSource,
                                            onPickAvatar,
                                            onPickCover,
                                            onEditPress,
                                            onClose
                                        }: ProfileInfoProps) {
    const dob = formatDate(user?.dob || 0);

    return (
        <View className="flex-1 bg-white">
            <ModalHeader
                title="Thông tin tài khoản"
                onRightPress={onClose}
                rightIconName="close"
            />

            <ScrollView className="flex-1 bg-gray-100 pb-16">
                <View className="items-center mb-2 mt-4 bg-white p-2">
                    <CoverImage customSource={coverSource} onPickImage={onPickCover}/>
                    <AvatarImage customSource={avatarSource} onPickImage={onPickAvatar}/>

                    <Text className="text-xl font-bold">{user?.name}</Text>
                </View>

                <View className="mt-2 bg-white p-4">
                    <Text className="text-base font-bold text-gray-800 mb-4">Thông tin cá nhân</Text>

                    <ProfileInfoItem label="Giới tính" value={genderMap[user?.gender]}/>
                    <ProfileInfoItem label="Ngày sinh" value={dob}/>
                    <ProfileInfoItem label="Điện thoại" value={user?.phone || ''}/>

                    <View className="mb-2">
                        <Text className="text-xs text-gray-500 mt-2">
                            Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 w-full p-3 bg-white border-t border-gray-200">
                <TouchableOpacity
                    onPress={onEditPress}
                    className="w-full self-center bg-blue-400 py-3 rounded-lg flex-row justify-center items-center"
                >
                    <Ionicons name="pencil-outline" size={18} color="white"/>
                    <Text className="text-white font-medium ml-2">Cập nhật</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
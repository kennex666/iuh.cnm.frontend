import React from "react";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import FormInput from "@/src/components/ui/FormInput";
import RadioButton from "@/src/components/profile/RadioButton";
import ModalHeader from "@/src/components/profile/ModelHeader";
import {formatDate} from "@/src/utils/datetime";
import {User} from "@/src/models/User";

type ProfileEditProps = {
    editUser: Partial<User> | null;
    onSave: () => void;
    onCancel: () => void;
    onChangeUser: (user: Partial<User>) => void;
};

export default function ProfileUserEdit({
                                            editUser,
                                            onSave,
                                            onCancel,
                                            onChangeUser
                                        }: ProfileEditProps) {
    const dob = formatDate(editUser?.dob || 0);

    return (
        <View className="flex-1 bg-white">
            <ModalHeader
                title="Cập nhật thông tin cá nhân"
                leftText="Hủy"
                rightText="Cập nhật"
                onLeftPress={onCancel}
                onRightPress={onSave}
            />

            <ScrollView className="p-4 bg-white">
                <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Tên hiển thị</Text>
                    <FormInput
                        icon="person-outline"
                        placeholder="Tên hiển thị"
                        value={editUser?.name || ''}
                        onChangeText={(text) => onChangeUser({...editUser, name: text})}
                    />
                </View>

                <Text className="text-gray-600 mb-2">Thông tin cá nhân</Text>

                <View className="mb-4">
                    <View className="flex-row mb-2">
                        <RadioButton
                            label="Nam"
                            selected={editUser?.gender === 'male'}
                            onPress={() => onChangeUser({...editUser, gender: 'male'})}
                        />
                        <RadioButton
                            label="Nữ"
                            selected={editUser?.gender === 'female'}
                            onPress={() => onChangeUser({...editUser, gender: 'female'})}
                        />
                        <RadioButton
                            label="Khác"
                            selected={editUser?.gender === 'other'}
                            onPress={() => onChangeUser({...editUser, gender: 'other'})}
                        />
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Ngày sinh</Text>
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <TouchableOpacity className="border border-gray-300 rounded-lg p-3">
                                <Text>{dob.split('/')[0]}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 mr-2">
                            <TouchableOpacity className="border border-gray-300 rounded-lg p-3">
                                <Text>{dob.split('/')[1]}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                            <TouchableOpacity className="border border-gray-300 rounded-lg p-3">
                                <Text>{dob.split('/')[2]}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
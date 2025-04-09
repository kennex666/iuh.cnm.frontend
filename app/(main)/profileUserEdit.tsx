import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform, Modal } from "react-native";
import FormInput from "@/src/components/ui/FormInput";
import RadioButton from "@/src/components/profile/RadioButton";
import ModalHeader from "@/src/components/profile/ModelHeader";
import { formatDate } from "@/src/utils/datetime";
import { User } from "@/src/models/User";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
    const [showDatePicker, setShowDatePicker] = useState(false);
    const dob = editUser?.dob ? formatDate(editUser.dob) : formatDate(Date.now());

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate && event.type !== 'dismissed') {
            console.log('Date selected:', selectedDate.toISOString());
            onChangeUser({...editUser, dob: selectedDate.getTime()});
        }
    };

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
                    {Platform.OS === 'web' ? (
                        <View className="border border-gray-300 rounded-lg px-4 py-3">
                            <input
                                type="date"
                                value={editUser?.dob ? new Date(editUser.dob).toISOString().split('T')[0] : ''}
                                onChange={(e) => onChangeUser({...editUser, dob: new Date(e.target.value).getTime()})}
                                className="w-full bg-transparent outline-none text-base"
                                max={new Date().toISOString().split('T')[0]}
                            />
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity
                                className="border border-gray-300 rounded-lg p-3"
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{dob}</Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={editUser?.dob ? new Date(editUser.dob) : new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                />
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
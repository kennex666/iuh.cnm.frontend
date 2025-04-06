import React, { useState } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Toast from '../components/Toast';

type ProfileModalProps = {
  visible: boolean;
  onClose: () => void;
}

export default function ProfileModal({ visible, onClose }: ProfileModalProps) {
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState({
        displayName: "John Doe",
        email: "john.doe@gmail.com",
        phone: "+84 123 456 789",
        bio: "Software Developer"
    });
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Lấy kích thước màn hình
    const { width, height } = Dimensions.get('window');
    const modalWidth = width >= 768 ? width * 0.25 : width * 0.8;
    const modalHeight = height * 0.8;  // 8/10 chiều cao màn hình

    const [editUser, setEditUser] = useState({...user});

    const handleEdit = () => {
        setUser({...editUser});
        setEditMode(false);
        setToast({
            visible: true,
            message: 'Cập nhật thông tin thành công!',
            type: 'success'
        });
    };

    const handleCancel = () => {
        setEditUser({...user});
        setEditMode(false);
    };

    const toggleEdit = () => {
        setEditUser({...user});
        setEditMode(true);
    };

    const closeModal = () => {
        setEditMode(false);
        onClose();
    };

    const InfoScreen = () => (
        <View className="flex-1">
            <View className="bg-blue-500 p-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={closeModal} className="p-2">
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold">Thông tin tài khoản</Text>
                    <TouchableOpacity onPress={toggleEdit} className="p-2">
                        <Ionicons name="create-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="p-4">
                <View className="items-center mb-6 mt-4">
                    <View className="bg-blue-500 rounded-full w-24 h-24 items-center justify-center">
                        <Text className="text-white text-3xl font-bold">{user.displayName[0]}</Text>
                    </View>
                    <Text className="text-xl font-bold mt-3">{user.displayName}</Text>
                </View>

                <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <View className="mb-4">
                        <Text className="text-gray-500 mb-1">Email</Text>
                        <Text className="text-black text-base">{user.email}</Text>
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 mb-1">Số điện thoại</Text>
                        <Text className="text-black text-base">{user.phone}</Text>
                    </View>

                    <View>
                        <Text className="text-gray-500 mb-1">Mô tả bản thân</Text>
                        <Text className="text-black text-base">{user.bio}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    const EditScreen = () => (
        <View className="flex-1">
            <View className="bg-blue-500 p-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={handleCancel} className="p-2">
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-lg font-bold">Chỉnh sửa thông tin</Text>
                    <TouchableOpacity onPress={handleEdit} className="p-2">
                        <Ionicons name="checkmark" size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="p-4">
                <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                    <View className="mb-4">
                        <Text className="text-gray-500 mb-1">Họ tên</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 text-base"
                            value={editUser.displayName}
                            onChangeText={(text) => setEditUser({...editUser, displayName: text})}
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 text-base"
                            value={editUser.email}
                            onChangeText={(text) => setEditUser({...editUser, email: text})}
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-500 mb-1">Số điện thoại</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 text-base"
                            value={editUser.phone}
                            onChangeText={(text) => setEditUser({...editUser, phone: text})}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-500 mb-1">Mô tả bản thân</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg p-2 text-base"
                            value={editUser.bio}
                            onChangeText={(text) => setEditUser({...editUser, bio: text})}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    return (
        <>
            <Modal
                animationType="fade"
                transparent={true}
                visible={visible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <TouchableWithoutFeedback>
                            <View style={{
                                width: modalWidth,
                                height: modalHeight,
                                backgroundColor: '#f3f4f6',
                                borderRadius: 16,
                                overflow: 'hidden'
                            }}>
                                <SafeAreaView className="flex-1">
                                    {editMode ? (
                                        <EditScreen />
                                    ) : (
                                        <InfoScreen />
                                    )}
                                </SafeAreaView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </>
    );
}
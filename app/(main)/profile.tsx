import React, {useState} from "react";
import {
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import Toast from '@/components/Toast';

type ProfileModalProps = {
    visible: boolean;
    onClose: () => void;
}

export default function ProfileModal({visible, onClose}: ProfileModalProps) {
    const [editMode, setEditMode] = useState(false);
    const [user, setUser] = useState({
        displayName: "Thiên Phú",
        gender: "Nam",
        dob: "08 tháng 03, 2002",
        phone: "+84 337 104 900",
        email: "thienphu@gmail.com",
        bio: "Xin chào, tôi là Thiên Phú. Tôi thích lập trình và du lịch.",
        avatar: require("../../assets/profile/avatar.png"),
        cover: require("../../assets/profile/cover.png"),
    });
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Get screen dimensions
    const {width, height} = Dimensions.get('window');
    const modalWidth = width >= 768 ? width * 0.25 : width * 0.8;
    const modalHeight = height * 0.8;

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
        <View className="flex-1 bg-white">
            <View className="bg-white p-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={closeModal} className="p-2">
                        <Ionicons name="close" size={24} color="black"/>
                    </TouchableOpacity>
                    <Text className="text-black text-lg font-medium">Thông tin tài khoản</Text>
                    <View className="w-8"/>
                </View>
            </View>

            <ScrollView className="flex-1 bg-gray-100">
                <View className="items-center mb-2 mt-4 bg-white p-4">
                    <View className="w-full h-48">
                        <Image
                            source={user.cover}
                            className="w-full h-full"
                            style={{width: '100%', height: 192}}
                            defaultSource={require("../../assets/profile/cover.png")}
                        />
                        <TouchableOpacity className="absolute bottom-4 right-4 bg-gray-100 rounded-full p-2">
                            <Ionicons name="camera" size={20} color="#4B5563"/>
                        </TouchableOpacity>
                    </View>
                    <View className="relative -mt-16 flex items-center">
                        <View className="border-4 border-white rounded-full">
                            <Image
                                source={user.avatar}
                                className="w-32 h-32 rounded-full"
                                style={{width: 128, height: 128}}
                                defaultSource={require("../../assets/profile/avatar.png")}
                            />
                            <TouchableOpacity className="absolute bottom-2 right-2 bg-gray-100 rounded-full p-2">
                                <Ionicons name="camera" size={20} color="#4B5563"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text className="text-xl font-bold">{user.displayName}</Text>
                    <TouchableOpacity onPress={toggleEdit} className="mt-2 flex-row items-center">
                        <Ionicons name="pencil-outline" size={16} color="#1E88E5"/>
                        <Text className="text-blue-500 ml-1">Cập nhật</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-2 bg-white p-4">
                    <Text className="text-base font-bold text-gray-800 mb-4">Thông tin cá nhân</Text>

                    <View className="mb-4 flex-row justify-between border-b border-gray-100 pb-3">
                        <Text className="text-gray-600">Giới tính</Text>
                        <Text className="text-black font-medium">{user.gender}</Text>
                    </View>

                    <View className="mb-4 flex-row justify-between border-b border-gray-100 pb-3">
                        <Text className="text-gray-600">Ngày sinh</Text>
                        <Text className="text-black font-medium">{user.dob}</Text>
                    </View>

                    <View className="mb-4 flex-row justify-between border-b border-gray-100 pb-3">
                        <Text className="text-gray-600">Điện thoại</Text>
                        <Text className="text-black font-medium">{user.phone}</Text>
                    </View>

                    <View className="mb-2">
                        <Text className="text-xs text-gray-500 mt-2">
                            Chỉ bạn bè có lưu số của bạn trong danh bạ mới xem được số này
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );

    const EditScreen = () => (
        <View className="flex-1 bg-white">
            <View className="bg-white p-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={handleCancel} className="p-2">
                        <Text className="text-gray-600">Hủy</Text>
                    </TouchableOpacity>
                    <Text className="text-black text-lg font-medium">Cập nhật thông tin cá nhân</Text>
                    <TouchableOpacity onPress={handleEdit} className="p-2">
                        <Text className="text-blue-500 font-medium">Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="p-4 bg-white">
                <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Tên hiển thị</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg p-3 text-base bg-white"
                        value={editUser.displayName}
                        onChangeText={(text) => setEditUser({...editUser, displayName: text})}
                    />
                </View>

                <Text className="text-gray-600 mb-2">Thông tin cá nhân</Text>

                <View className="mb-4">
                    <View className="flex-row mb-2">
                        <TouchableOpacity
                            className={`flex-row items-center mr-4 ${editUser.gender === 'Nam' ? 'opacity-100' : 'opacity-50'}`}
                            onPress={() => setEditUser({...editUser, gender: 'Nam'})}
                        >
                            <View
                                className={`w-5 h-5 rounded-full border ${editUser.gender === 'Nam' ? 'border-blue-500' : 'border-gray-400'} mr-1 items-center justify-center`}>
                                {editUser.gender === 'Nam' && <View className="w-3 h-3 rounded-full bg-blue-500"/>}
                            </View>
                            <Text>Nam</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center ${editUser.gender === 'Nữ' ? 'opacity-100' : 'opacity-50'}`}
                            onPress={() => setEditUser({...editUser, gender: 'Nữ'})}
                        >
                            <View
                                className={`w-5 h-5 rounded-full border ${editUser.gender === 'Nữ' ? 'border-blue-500' : 'border-gray-400'} mr-1 items-center justify-center`}>
                                {editUser.gender === 'Nữ' && <View className="w-3 h-3 rounded-full bg-blue-500"/>}
                            </View>
                            <Text>Nữ</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-600 mb-2">Ngày sinh</Text>
                    <View className="flex-row">
                        <View className="flex-1 mr-2">
                            <TouchableOpacity className="border border-gray-300 rounded-lg p-3">
                                <Text>08</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1 mr-2">
                            <TouchableOpacity className="border border-gray-300 rounded-lg p-3">
                                <Text>03</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-1">
                            <TouchableOpacity className="border border-gray-300 rounded-lg p-3">
                                <Text>2002</Text>
                            </TouchableOpacity>
                        </View>
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
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                overflow: 'hidden'
                            }}>
                                <SafeAreaView className="flex-1">
                                    {editMode ? (
                                        <EditScreen/>
                                    ) : (
                                        <InfoScreen/>
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
                onHide={() => setToast(prev => ({...prev, visible: false}))}
            />
        </>
    );
}
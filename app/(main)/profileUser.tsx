import React, {useState} from "react";
import {
    Alert,
    Dimensions,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Ionicons} from '@expo/vector-icons';
import Toast from '@/src/components/ui/Toast';
import * as ImagePicker from 'expo-image-picker';
import FormInput from "@/src/components/ui/FormInput";
import ModalHeader from "@/src/components/profile/ModelHeader";
import CoverImage from "@/src/components/profile/CoverImage";
import AvatarImage from "@/src/components/profile/AvatarImage";
import ProfileInfoItem from "@/src/components/profile/ProfileInfoItem";
import RadioButton from "@/src/components/profile/RadioButton";

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
        avatar: require("@/resources/assets/profile/avatar.png"),
        cover: require("@/resources/assets/profile/cover.png"),
    });

    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [coverUri, setCoverUri] = useState<string | null>(null);
    const [editUser, setEditUser] = useState({...user});
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Get screen dimensions
    const {width, height} = Dimensions.get('window');
    const modalWidth = width >= 768 ? width * 0.25 : width * 0.8;
    const modalHeight = height * 0.8;

    const requestMediaLibraryPermission = async () => {
        if (Platform.OS !== 'web') {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Thông báo', 'Cần quyền truy cập vào thư viện ảnh để sử dụng tính năng này!');
                return false;
            }
            return true;
        }
        return true;
    };

    const handlePickAvatar = async () => {
        const hasPermission = await requestMediaLibraryPermission();

        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setAvatarUri(result.assets[0].uri);
            console.log('Avatar URI:', result.assets[0].uri);
            Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện!');
        }
    };

    const handlePickCover = async () => {
        const hasPermission = await requestMediaLibraryPermission();

        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setCoverUri(result.assets[0].uri);
            console.log('Cover URI:', result.assets[0].uri);
            Alert.alert('Thành công', 'Đã cập nhật ảnh bìa!');
        }
    };

    const avatarSource = avatarUri
        ? {uri: avatarUri}
        : user.avatar;

    const coverSource = coverUri
        ? {uri: coverUri}
        : user.cover;

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
            <ModalHeader
                title="Thông tin tài khoản"
                onLeftPress={closeModal}
            />

            <ScrollView className="flex-1 bg-gray-100">
                <View className="items-center mb-2 mt-4 bg-white p-2">
                    <CoverImage source={coverSource} onPickImage={handlePickCover}/>
                    <AvatarImage source={avatarSource} onPickImage={handlePickAvatar}/>

                    <Text className="text-xl font-bold">{user.displayName}</Text>
                    <TouchableOpacity onPress={toggleEdit} className="mt-2 flex-row items-center">
                        <Ionicons name="pencil-outline" size={16} color="#1E88E5"/>
                        <Text className="text-blue-500 ml-1">Cập nhật</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-2 bg-white p-4">
                    <Text className="text-base font-bold text-gray-800 mb-4">Thông tin cá nhân</Text>

                    <ProfileInfoItem label="Giới tính" value={user.gender}/>
                    <ProfileInfoItem label="Ngày sinh" value={user.dob}/>
                    <ProfileInfoItem label="Điện thoại" value={user.phone}/>

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
            <ModalHeader
                title="Cập nhật thông tin cá nhân"
                leftText="Hủy"
                rightText="Cập nhật"
                onLeftPress={handleCancel}
                onRightPress={handleEdit}
            />

            <ScrollView className="p-4 bg-white">
                <View className="mb-4">
                    <Text className="text-gray-600 mb-1">Tên hiển thị</Text>
                    <FormInput
                        icon="person-outline"
                        placeholder="Tên hiển thị"
                        value={editUser.displayName}
                        onChangeText={(text) => setEditUser({...editUser, displayName: text})}
                    />
                </View>

                <Text className="text-gray-600 mb-2">Thông tin cá nhân</Text>

                <View className="mb-4">
                    <View className="flex-row mb-2">
                        <RadioButton
                            label="Nam"
                            selected={editUser.gender === 'Nam'}
                            onPress={() => setEditUser({...editUser, gender: 'Nam'})}
                        />
                        <RadioButton
                            label="Nữ"
                            selected={editUser.gender === 'Nữ'}
                            onPress={() => setEditUser({...editUser, gender: 'Nữ'})}
                        />
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
                                    {editMode ? <EditScreen/> : <InfoScreen/>}
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

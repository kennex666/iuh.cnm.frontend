import React, {useState} from "react";
import {Alert, Dimensions, Modal, Platform, SafeAreaView, TouchableWithoutFeedback, View} from "react-native";
import Toast from '@/src/components/ui/Toast';
import * as ImagePicker from 'expo-image-picker';
import {useUser} from "@/src/hooks/useUser";
import ProfileUserInfo from "./profileUserInfo";
import ProfileUserEdit from "./profileUserEdit";

type ProfileModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function ProfileModal({visible, onClose}: ProfileModalProps) {
    const {user: fetchedUser} = useUser();
    const [editMode, setEditMode] = useState(false);
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [coverUri, setCoverUri] = useState<string | null>(null);
    const [editUser, setEditUser] = useState({...fetchedUser});
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

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
            Alert.alert('Thành công', 'Đã cập nhật ảnh bìa!');
        }
    };

    const avatarSource = avatarUri
        ? {uri: avatarUri}
        : {uri: fetchedUser?.avatarURL};

    const coverSource = coverUri
        ? {uri: coverUri}
        : {uri: fetchedUser?.coverURL};

    const handleEdit = () => {
        setToast({
            visible: true,
            message: 'Cập nhật thông tin thành công!',
            type: 'success'
        });
        setEditMode(false);
    };

    const handleCancel = () => {
        setEditUser({...fetchedUser});
        setEditMode(false);
    };

    const toggleEdit = () => {
        setEditUser({...fetchedUser});
        setEditMode(true);
    };

    const closeModal = () => {
        setEditMode(false);
        onClose();
    };

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
                                        <ProfileUserEdit
                                            editUser={editUser}
                                            onSave={handleEdit}
                                            onCancel={handleCancel}
                                            onChangeUser={setEditUser}
                                        />
                                    ) : (
                                        <ProfileUserInfo
                                            user={fetchedUser}
                                            avatarSource={avatarSource}
                                            coverSource={coverSource}
                                            onPickAvatar={handlePickAvatar}
                                            onPickCover={handlePickCover}
                                            onEditPress={toggleEdit}
                                            onClose={closeModal}
                                        />
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
import * as ImagePicker from 'expo-image-picker';
import {Alert, Platform} from 'react-native';

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

const pickImage = async (options: {
    aspect: [number, number],
    successMessage: string
}) => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission)
        return {success: false, uri: null, message: 'Không có quyền truy cập vào thư viện ảnh!'};

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: options.aspect,
        quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0)
        return {success: true, uri: result.assets[0].uri, message: options.successMessage};

    return {success: false, uri: null, message: 'Không có ảnh nào được chọn!'};
};

export const pickAvatar = async () =>
    pickImage({ aspect: [1, 1], successMessage: 'Đã cập nhật ảnh đại diện!' });

export const pickCover = async () =>
    pickImage({ aspect: [16, 9], successMessage: 'Đã cập nhật ảnh bìa!' });
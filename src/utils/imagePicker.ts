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

export const pickAvatar = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission)
        return {success: false, uri: null, message: 'Không có quyền truy cập vào thư viện ảnh!'}

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0)
        return {success: true, uri: result.assets[0].uri, message: 'Đã cập nhật ảnh đại diện!'};

    return {success: false, uri: null, message: 'Không có ảnh nào được chọn!'};
};

export const pickCover = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission)
        return {success: false, uri: null, message: 'Không có quyền truy cập vào thư viện ảnh!'}

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0)
        return {success: true, uri: result.assets[0].uri, message: 'Đã cập nhật ảnh bìa!'};

    return {success: false, uri: null, message: 'Không có ảnh nào được chọn!'};
};

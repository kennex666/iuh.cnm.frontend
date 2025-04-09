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

    if (!hasPermission) return null;

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện!');
        return result.assets[0].uri;
    }

    return null;
};

export const pickCover = async () => {
    const hasPermission = await requestMediaLibraryPermission();

    if (!hasPermission) return null;

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        Alert.alert('Thành công', 'Đã cập nhật ảnh bìa!');
        return result.assets[0].uri;
    }

    return null;
};

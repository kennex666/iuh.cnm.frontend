import * as ImagePicker from 'expo-image-picker';
import {Alert, Linking, Platform} from 'react-native';

interface ImagePickerResult {
    success: boolean;
    uri: string | null;
    message: string;
    width?: number;
    height?: number;
    name?: string;
    mimeType?: string;
}

interface PickImageOptions {
    aspect: [number, number];
    successMessage: string;
    allowsEditing?: boolean;
    quality?: number;
}

const mediaTypes: ImagePicker.MediaType[] = ["images"]
let mediaLibraryPermissionGranted: boolean | null = null;

const requestMediaLibraryPermission = async (): Promise<boolean> => {
    if (mediaLibraryPermissionGranted !== null) {
        return mediaLibraryPermissionGranted;
    }

    if (Platform.OS === 'web') {
        mediaLibraryPermissionGranted = true;
        return true;
    }

    try {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const granted = status === 'granted';

        mediaLibraryPermissionGranted = granted;

        if (!granted) {
            Alert.alert(
                'Quyền truy cập bị từ chối',
                'Cần quyền truy cập vào thư viện ảnh để sử dụng tính năng này. Vui lòng cấp quyền trong cài đặt.',
                [
                    {text: 'Đóng'},
                    {
                        text: 'Đi đến Cài đặt',
                        onPress: () => {
                            Linking.openSettings().catch(() => {
                                if (__DEV__) {
                                    console.warn('Failed to open settings');
                                }
                            });
                        }
                    }
                ]
            );
        }

        return granted;
    } catch (error) {
        if (__DEV__) {
            console.warn('Error requesting media library permission:', error);
        }
        return false;
    }
};

const pickImage = async (options: PickImageOptions): Promise<ImagePickerResult> => {
    const defaultOptions = {
        allowsEditing: true,
        quality: 0.7,
    };

    const finalOptions = {...defaultOptions, ...options};

    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
        return {
            success: false,
            uri: null,
            message: 'Không có quyền truy cập vào thư viện ảnh!'
        };
    }

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: mediaTypes,
            allowsEditing: finalOptions.allowsEditing,
            aspect: finalOptions.aspect,
            quality: finalOptions.quality,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            return {
                success: true,
                uri: asset.uri,
                message: finalOptions.successMessage,
                width: asset.width,
                height: asset.height,
                name: asset.fileName || `image_${Date.now()}.jpg`,
                mimeType: asset.mimeType
            };
        }

        return {
            success: false,
            uri: null,
            message: 'Không có ảnh nào được chọn!'
        };
    } catch (error) {
        if (__DEV__) {
            console.warn('Error picking image:', error);
        }

        return {
            success: false,
            uri: null,
            message: 'Đã xảy ra lỗi khi chọn ảnh!'
        };
    }
};

export const pickAvatar = async (): Promise<ImagePickerResult> => {
    return pickImage({
        aspect: [1, 1],
        successMessage: 'Đã cập nhật ảnh đại diện!',
        allowsEditing: true
    });
};

export const pickCover = async (): Promise<ImagePickerResult> => {
    return pickImage({
        aspect: [16, 9],
        successMessage: 'Đã cập nhật ảnh bìa!',
        allowsEditing: true
    });
};

export const pickMultipleImages = async (): Promise<{
    success: boolean;
    uris: string[];
    message: string;
}> => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
        return {
            success: false,
            uris: [],
            message: 'Không có quyền truy cập vào thư viện ảnh!'
        };
    }

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: mediaTypes,
            allowsMultipleSelection: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uris = result.assets.map(asset => asset.uri);
            return {
                success: true,
                uris,
                message: `Đã chọn ${uris.length} ảnh!`
            };
        }

        return {
            success: false,
            uris: [],
            message: 'Không có ảnh nào được chọn!'
        };
    } catch (error) {
        if (__DEV__) {
            console.warn('Error picking multiple images:', error);
        }

        return {
            success: false,
            uris: [],
            message: 'Đã xảy ra lỗi khi chọn ảnh!'
        };
    }
};

import React, {useState} from 'react';
import {Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '@/src/components/ui/Toast';
import GradientBackground from '@/src/components/auth/GradientBackground';
import AppLogo from '@/src/components/auth/AppLogo';
import AuthHeader from '@/src/components/auth/AuthHeader';
import Button from '@/src/components/ui/Button';
import TextLink from '@/src/components/ui/TextLink';

// Sample images - in a real app, these would come from your backend
const SAMPLE_IMAGES = [
    {id: 1, name: "Hình 1", url: 'https://picsum.photos/200/200?random=1'},
    {id: 2, name: "Hình 2", url: 'https://picsum.photos/200/200?random=2'},
    {id: 3, name: "Hình 3", url: 'https://picsum.photos/200/200?random=3'},
    {id: 4, name: "Hình 4", url: 'https://picsum.photos/200/200?random=4'},
    {id: 5, name: "Hình 5", url: 'https://picsum.photos/200/200?random=5'},
    {id: 6, name: "Hình 6", url: 'https://picsum.photos/200/200?random=6'},
    {id: 7, name: "Hình 7", url: 'https://picsum.photos/200/200?random=7'},
    {id: 8, name: "Hình 8", url: 'https://picsum.photos/200/200?random=8'},
    {id: 9, name: "Hình 9", url: 'https://picsum.photos/200/200?random=9'},
    {id: 10, name: "Hình 10", url: 'https://picsum.photos/200/200?random=10'},
    {id: 11, name: "Hình 11", url: 'https://picsum.photos/200/200?random=11'},
    {id: 12, name: "Hình 12", url: 'https://picsum.photos/200/200?random=12'},
];

export default function ImageAuth() {
    // State of selected images
    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    // State of loading
    const [loading, setLoading] = useState(false);
    // State of toast
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    // Router   
    const router = useRouter();
    // Safe area insets
    const insets = useSafeAreaInsets();

    // Toggle image selection
    const toggleImageSelection = (imageId: number) => {
        if (selectedImages.includes(imageId)) {
            // Remove image if already selected
            setSelectedImages(selectedImages.filter(id => id !== imageId));
        } else {
            // Add image if not already selected and less than 3 images are selected
            if (selectedImages.length < 3) {
                setSelectedImages([...selectedImages, imageId]);
            } else {
                setToast({
                    visible: true,
                    message: 'Bạn chỉ được chọn tối đa 3 hình ảnh',
                    type: 'error'
                });
            }
        }
    };

    const handleSubmit = async () => {
        // Check if 3 images are selected
        if (selectedImages.length !== 3) {
            setToast({
                visible: true,
                message: 'Vui lòng chọn đúng 3 hình ảnh',
                type: 'error'
            });
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement actual image authentication API call
            // This is a mock implementation
            await new Promise(resolve => setTimeout(resolve, 1500));

            setToast({
                visible: true,
                message: 'Xác thực thành công!',
                type: 'success'
            });

            // Navigate to main screen after 2 seconds
            setTimeout(() => {
                router.replace('/(main)');
            }, 2000);
        } catch (error) {
            setToast({
                visible: true,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau',
                type: 'error'
            });
            console.error('Image authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerStyle={{flexGrow: 1}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View
                        className="flex-1 justify-end items-center px-4 pb-6"
                        style={{paddingTop: Math.max(insets.top, 20)}}
                    >
                        <View className="w-full max-w-[100%] sm:max-w-[420px]">
                            <AppLogo/>

                            <View className="mt-4">
                                <AuthHeader
                                    title="Xác thực bằng hình ảnh"
                                    subtitle={'Chọn 3 hình ảnh để đăng nhập'}
                                />

                                <View className="mt-4">
                                    <Text className="text-gray-600 mb-2 py-2">
                                        Đã chọn: {selectedImages.length}/3 hình ảnh
                                    </Text>

                                    <View className="flex-row flex-wrap justify-between">
                                        {/* Render images */}
                                        {SAMPLE_IMAGES.map((image) => (
                                            <TouchableOpacity
                                                key={image.id}
                                                onPress={() => toggleImageSelection(image.id)}
                                                className={`flex flex-col items-center justify-center w-[30%] aspect-square mb-3 rounded-lg overflow-hidden border-2 ${
                                                    selectedImages.includes(image.id)
                                                        ? 'border-blue-500'
                                                        : 'border-transparent'
                                                }`}
                                            >

                                                {/* <Text className="text-black text-center text-sm font-medium">
                                                        {image.name}
                                                    </Text> */}
                                                <Image
                                                    source={{uri: image.url}}
                                                    className="w-24 h-24 rounded-full"
                                                    resizeMode="cover"
                                                />
                                                <View className="">
                                                    <Text className="text-black text-center text-sm font-medium">
                                                        {image.name}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <Button
                                        title="Xác nhận"
                                        onPress={handleSubmit}
                                        loading={loading}
                                        className="mt-4"
                                    />

                                    <TextLink
                                        href="/"
                                        text="Quay lại đăng nhập"
                                        linkText="Tại đây"
                                        className="mt-4"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({...prev, visible: false}))}
            />
        </GradientBackground>
    );
} 
import React, {useState} from 'react';
import {View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '@/src/components/ui/Toast';
import GradientBackground from '@/src/components/auth/GradientBackground';
import AppLogo from '@/src/components/auth/AppLogo';
import AuthHeader from '@/src/components/auth/AuthHeader';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import TextLink from '@/src/components/ui/TextLink';

export default function Register() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const validateForm = () => {
        if (!phoneNumber) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập số điện thoại',
                type: 'error'
            });
            return false;
        }
        if (!name) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập họ tên',
                type: 'error'
            });
            return false;
        }
        if (!password) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập mật khẩu',
                type: 'error'
            });
            return false;
        }
        if (password !== confirmPassword) {
            setToast({
                visible: true,
                message: 'Mật khẩu nhập lại không khớp',
                type: 'error'
            });
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setToast({
                visible: true,
                message: 'Đăng ký thành công!',
                type: 'success'
            });

            // Đợi toast hiển thị xong rồi chuyển trang
            setTimeout(() => {
                router.replace('/(main)');
            }, 2000);
        } catch (error) {
            setToast({
                visible: true,
                message: 'Đã có lỗi xảy ra, vui lòng thử lại',
                type: 'error'
            });
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
                            <AppLogo />

                            <View className="mt-4">
                                <AuthHeader
                                    title="Tạo tài khoản mới"
                                    subtitle={'Đăng ký để trải nghiệm những tính năng\ntuyệt vời cùng bạn bè'}
                                />

                                <View className="mt-4 space-y-3">
                                    <FormInput
                                        icon="call-outline"
                                        placeholder="Số điện thoại"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        keyboardType="phone-pad"
                                        editable={!loading}
                                    />

                                    <FormInput
                                        icon="person-outline"
                                        placeholder="Họ và tên"
                                        value={name}
                                        onChangeText={setName}
                                        editable={!loading}
                                    />

                                    <FormInput
                                        icon="lock-closed-outline"
                                        placeholder="Mật khẩu"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        showTogglePassword
                                        editable={!loading}
                                    />

                                    <FormInput
                                        icon="lock-closed-outline"
                                        placeholder="Nhập lại mật khẩu"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                        showTogglePassword
                                        editable={!loading}
                                    />

                                    <Button
                                        title="Đăng ký"
                                        onPress={handleRegister}
                                        loading={loading}
                                        className="mt-2"
                                    />

                                    <TextLink
                                        href="/"
                                        text="Đã có tài khoản?"
                                        linkText="Đăng nhập ngay"
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
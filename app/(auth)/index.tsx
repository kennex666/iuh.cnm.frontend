import React, {useState} from 'react';
import {Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform} from 'react-native';
import {useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '@/src/components/ui/Toast';
import GradientBackground from '@/src/components/auth/GradientBackground';
import AppLogo from '@/src/components/auth/AppLogo';
import AuthHeader from '@/src/components/auth/AuthHeader';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import TextLink from '@/src/components/ui/TextLink';
import Divider from '@/src/components/ui/Divider';
import {useAuth} from '@/src/contexts/userContext';

export default function Login() {
    const {login} = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    const router = useRouter();
    // useSafeAreaInsets is used to get the insets of the device
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
        if (!password) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập mật khẩu',
                type: 'error'
            });
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Gọi API đăng nhập thực tế
            const result = await login(phoneNumber, password);

            if (result.success) {
                setToast({
                    visible: true,
                    message: 'Đăng nhập thành công!',
                    type: 'success'
                });

                // Đợi toast hiển thị xong rồi chuyển trang
                setTimeout(() => {
                    router.replace('/(main)');
                }, 2000);
            } else {
                setToast({
                    visible: true,
                    message: result.message || 'Đăng nhập thất bại',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                visible: true,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau',
                type: 'error'
            });
            console.error('Login error:', error);
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
                                    title="Welcome Back!"
                                    subtitle={'Đăng nhập để kết nối với bạn bè và\nngười thân của bạn'}
                                />

                                <View className="mt-4 space-y-3">
                                    <FormInput
                                        icon="person-outline"
                                        placeholder="Số điện thoại"
                                        value={phoneNumber}
                                        onChangeText={setPhoneNumber}
                                        editable={!loading}
                                        keyboardType="phone-pad"
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

                                    <TouchableOpacity 
                                        className="self-end" 
                                        activeOpacity={0.6}
                                        onPress={() => router.push('/forgot-password')}
                                    >
                                        <Text className="text-blue-500 font-medium text-xs sm:text-sm">
                                            Quên mật khẩu?
                                        </Text>
                                    </TouchableOpacity>

                                    <Button
                                        title="Đăng nhập"
                                        onPress={handleLogin}
                                        loading={loading}
                                        className="mt-2"
                                    />

                                    <Divider text="Hoặc" className="mt-3"/>

                                    <Button
                                        title="Đăng nhập bằng mã QR"
                                        onPress={() => {}}
                                        variant="outline"
                                        icon="qr-code-outline"
                                        className="mt-2"
                                    />

                                    <TextLink
                                        href="/register"
                                        text="Chưa có tài khoản?"
                                        linkText="Đăng ký ngay"
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
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
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
    const {login, user} = useAuth();
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

    useEffect(() => {
        if (user) {
            router.push('/(main)');
        }
    }, [user]);

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
            console.log('Attempting login with:', phoneNumber, password);
            const result = await login(phoneNumber, password);
            console.log('Login result:', result);

            if (result.success) {
                setToast({
                    visible: true,
                    message: 'Đăng nhập thành công! Vui lòng nhập mã 2FA',
                    type: 'success'
                });
                setTimeout(() => {
                    router.push('/verify-2fa');
                }, 2000);
            } else {
                setToast({
                    visible: true,
                    message: result.message || 'Đăng nhập thất bại',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            setToast({
                visible: true,
                message: `Có lỗi xảy ra: ${error || 'Unknown error'}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleQrCodeLogin = () => {
        // Handle QR code login here
        console.log('QR code login pressed');
        router.push('/qrcode');
    }

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
                        className="flex-1 justify-start items-center px-4 pt-8 sm:justify-center sm:px-6 md:px-8 lg:px-10"
                        style={{paddingTop: Math.max(insets.top + 20, 40)}}
                    >
                        <View className="w-full max-w-[100%] sm:max-w-[420px]">
                            <AppLogo/>

                            <View className="mt-4 sm:mt-6">
                                <AuthHeader
                                    title="Welcome Back!"
                                    subtitle={'Đăng nhập để kết nối với bạn bè và\nngười thân của bạn'}
                                />

                                <View className="mt-4 space-y-3 sm:space-y-4">
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
                                        <Text className="text-blue-500 font-medium text-xs sm:text-sm py-2">
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
                                        onPress={handleQrCodeLogin}
                                        variant="outline"
                                        icon="qr-code-outline"
                                        className="mt-2"
                                    />

                                    {/* Tính năng phát triển */}
                                    {/* <Button
                                        title="Đăng nhập bằng hình ảnh"
                                        onPress={() => router.push('/image-auth')}
                                        variant="outline"
                                        icon="images-outline"
                                        className="mt-2"
                                    /> */}

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
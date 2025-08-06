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
import {useUser} from '@/src/contexts/user/UserContext';

export default function Login() {
    const {login, user, isAuthenticated} = useUser();
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
		if (user && isAuthenticated) {
			router.replace("/(main)");
		}
	}, [user, isAuthenticated]);

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
            const result = await login({phone: phoneNumber, password});

            if (result.success) {
                setToast({
                    visible: true,
                    message: 'Đăng nhập thành công! Vui lòng nhập mã 2FA',
                    type: 'success'
                });
            } else {
                if (result.errorCode == 203) {
                    setToast({
                        visible: true,
                        message: 'Hãy nhập mã xác thực 2FA',
                        type: 'success'
                    });

                    setTimeout(() => {
                        router.push(
                            {
                                pathname: '/(auth)/verify-2fa',
                                params: {
                                    phone: phoneNumber,
                                    password: password
                                }
                            }
                        );
                    }, 2000);
                    return;
                }
                if (result.errorCode == 207) {
                    setToast({
                        visible: true,
                        message: 'Tai khoản chưa được xác thực. Vui lòng kiểm tra tin nhắn SMS để xác thực tài khoản của bạn.',
                        type: 'success'
                    });
                    setTimeout(() => {
                        router.push(
                            {
                                pathname: '/(auth)/verify-account',
                                params: {
                                    phone: phoneNumber,
                                }
                            }
                        );
                    }, 2000);
                    return;
                }
                setToast({
                    visible: true,
                    message: result.message || 'Đăng nhập thất bại',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                visible: true,
                message: `Đăng nhập thất bại: ${error.message || 'Lỗi không xác định'}`,
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

                            <View className="mt-4 sm:mt-2">
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
                                        onEnterPress={!loading ? handleLogin : undefined}
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

                                  

                                    {
                                        Platform.OS === 'web' && (
                                            <>
                                                <Divider text="Hoặc" className="mt-3"/>
                                                <Button
                                                    title="Đăng nhập bằng mã QR"
                                                    onPress={handleQrCodeLogin}
                                                    variant="outline"
                                                    icon="qr-code-outline"
                                                    className="mt-2"
                                                />
                                            </>
                                        )
                                    }

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
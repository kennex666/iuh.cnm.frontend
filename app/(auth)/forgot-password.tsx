import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '@/src/components/ui/Toast';
import GradientBackground from '@/src/components/auth/GradientBackground';
import AppLogo from '@/src/components/auth/AppLogo';
import AuthHeader from '@/src/components/auth/AuthHeader';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import TextLink from '@/src/components/ui/TextLink';

export default function ForgotPassword() {
    const [phoneNumber, setPhoneNumber] = useState('');
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
        return true;
    };

    const handleResetPassword = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // TODO: Implement actual password reset API call
            // This is a mock implementation
            await new Promise(resolve => setTimeout(resolve, 1500));

            setToast({
                visible: true,
                message: 'Mã xác thực đã được gửi đến số điện thoại của bạn',
                type: 'success'
            });

            // Navigate to verification screen after 2 seconds
            setTimeout(() => {
                router.push('./verify-reset-code');
            }, 2000);
        } catch (error) {
            setToast({
                visible: true,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau',
                type: 'error'
            });
            console.error('Reset password error:', error);
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
                                    title="Quên mật khẩu"
                                    subtitle={'Nhập số điện thoại để nhận mã xác thực\nvà đặt lại mật khẩu của bạn'}
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

                                    <Button
                                        title="Gửi mã xác thực"
                                        onPress={handleResetPassword}
                                        loading={loading}
                                        className="mt-2"
                                    />

                                    <TextLink
                                        href="/"
                                        text="Đã nhớ mật khẩu?"
                                        linkText="Đăng nhập"
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
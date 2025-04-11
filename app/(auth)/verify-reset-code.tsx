import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {router, useLocalSearchParams, useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '@/src/components/ui/Toast';
import GradientBackground from '@/src/components/auth/GradientBackground';
import AppLogo from '@/src/components/auth/AppLogo';
import AuthHeader from '@/src/components/auth/AuthHeader';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import TextLink from '@/src/components/ui/TextLink';
import {AuthService} from '@/src/api/services/AuthService';

export default function VerifyResetCode() {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    const insets = useSafeAreaInsets();
    const router = useRouter();
    
    const [phone, setPhone] = useState<string>('');
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.phone) {
            setPhone(params.phone as string);
        } else {
            // Xử lý khi không có phone
            setToast({
                visible: true,
                message: 'Không tìm thấy thông tin số điện thoại',
                type: 'error'
            });
            setTimeout(() => router.back(), 1500);
        }
        console.log('Phone number from params:', phone);
    }, [params?.phone]);

    const validateForm = () => {
        if (!verificationCode) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập mã xác thực',
                type: 'error'
            });
            return false;
        }
        if (verificationCode.length !== 6) {
            setToast({
                visible: true,
                message: 'Mã xác thực phải có 6 chữ số',
                type: 'error'
            });
            return false;
        }
        return true;
    };

    const handleVerifyCode = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // TODO: Implement actual verification API call
            // This is a mock implementation
            const response = await AuthService.forgotPassword(
                {
                    phone: phone,
                    otp: verificationCode
                }
            );
            if (!response.success) {
                setToast({
                    visible: true,
                    message: 'Mã xác thực không hợp lệ',
                    type: 'error'
                });
                return;
            }

            setToast({
                visible: true,
                message: 'Xác thực thành công!',
                type: 'success'
            });

            // Navigate to new password screen after 2 seconds
            setTimeout(() => {
                router.push({
                    pathname: '/(auth)/reset-password',
                    params: { phone, otp: verificationCode }
                });
            }, 2000);
        } catch (error) {
            setToast({
                visible: true,
                message: 'Có lỗi xảy ra, vui lòng thử lại sau',
                type: 'error'
            });
            console.error('Verification error:', error);
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
                                    title="Xác thực mã"
                                    subtitle={'Nhập mã xác thực đã được gửi đến\nsố điện thoại của bạn'}
                                />

                                <View className="mt-4 space-y-3">
                                    <FormInput
                                        icon="key-outline"
                                        placeholder="Mã xác thực"
                                        value={verificationCode}
                                        onChangeText={(text) => setVerificationCode(text.slice(0, 6))}
                                        editable={!loading}
                                        keyboardType="numeric"
                                    />

                                    <Button
                                        title="Xác nhận"
                                        onPress={handleVerifyCode}
                                        loading={loading}
                                        className="mt-2"
                                    />

                                    <TextLink
                                        href="./forgot-password"
                                        text="Không nhận được mã?"
                                        linkText="Gửi lại"
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
import React, {useState} from 'react';
import {View} from 'react-native';
import {useRouter} from 'expo-router';
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
            <View className="flex-1 justify-center items-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
                <View className="w-full max-w-[420px]">
                    <AppLogo/>

                    <AuthHeader
                        title="Quên mật khẩu"
                        subtitle={'Nhập số điện thoại để nhận mã xác thực\nvà đặt lại mật khẩu của bạn'}
                    />

                    <View className="space-y-4 sm:space-y-5">
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
                            className="mt-4"
                        />

                        <TextLink
                            href="/"
                            text="Đã nhớ mật khẩu?"
                            linkText="Đăng nhập"
                            className="mt-6 sm:mt-8"
                        />
                    </View>
                </View>
            </View>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({...prev, visible: false}))}
            />
        </GradientBackground>
    );
} 
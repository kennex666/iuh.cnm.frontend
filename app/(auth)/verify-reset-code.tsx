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

export default function VerifyResetCode() {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    const router = useRouter();

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
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setToast({
                visible: true,
                message: 'Xác thực thành công!',
                type: 'success'
            });
            
            // Navigate to new password screen after 2 seconds
            setTimeout(() => {
                router.navigate('/');
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
            <View className="flex-1 justify-center items-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
                <View className="w-full max-w-[420px]">
                    <AppLogo/>

                    <AuthHeader
                        title="Xác thực mã"
                        subtitle={'Nhập mã xác thực đã được gửi đến\nsố điện thoại của bạn'}
                    />

                    <View className="space-y-4 sm:space-y-5">
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
                            className="mt-4"
                        />

                        <TextLink
                            href="./forgot-password"
                            text="Không nhận được mã?"
                            linkText="Gửi lại"
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
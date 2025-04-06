import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useRouter} from 'expo-router';
import Toast from '@/components/Toast';
import GradientBackground from '@/components/primary/GradientBackground';
import AppLogo from '@/components/primary/AppLogo';
import AuthHeader from '@/components/primary/AuthHeader';
import FormInput from '@/components/primary/FormInput';
import Button from '@/components/primary/Button';
import TextLink from '@/components/primary/TextLink';
import Divider from '@/components/primary/Divider';

export default function Login() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
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
            // Giả lập API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setToast({
                visible: true,
                message: 'Đăng nhập thành công!',
                type: 'success'
            });

            // Đợi toast hiển thị xong rồi chuyển trang
            setTimeout(() => {
                router.replace('/(main)');
            }, 2000);
        } catch (error) {
            setToast({
                visible: true,
                message: 'Số điện thoại hoặc mật khẩu không đúng',
                type: 'error'
            });
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
                        title="Welcome Back!"
                        subtitle={'Đăng nhập để kết nối với bạn bè và\nngười thân của bạn'}
                    />

                    <View className="space-y-4 sm:space-y-5">
                        <FormInput
                            icon="person-outline"
                            placeholder="Số điện thoại hoặc email"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
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

                        <TouchableOpacity className="self-end" activeOpacity={0.6}>
                            <Text className="text-blue-500 font-medium text-xs sm:text-sm">
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>

                        <Button
                            title="Đăng nhập"
                            onPress={handleLogin}
                            loading={loading}
                            className="mt-4"
                        />

                        <Divider text="Hoặc"/>

                        <Button
                            title="Đăng nhập bằng mã QR"
                            onPress={() => {
                            }}
                            variant="outline"
                            icon="qr-code-outline"
                        />

                        <TextLink
                            href="/register"
                            text="Chưa có tài khoản?"
                            linkText="Đăng ký ngay"
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
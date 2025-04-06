import React, {useState} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {useRouter} from 'expo-router';
import Toast from '../components/Toast';
import GradientBackground from '../components/primary/GradientBackground';
import AppLogo from '../components/primary/AppLogo';
import AuthHeader from '../components/primary/AuthHeader';
import FormInput from '../components/primary/FormInput';
import Button from '../components/primary/Button';
import TextLink from '../components/primary/TextLink';

export default function Register() {
    const {width} = useWindowDimensions();
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

    const handleLogin = () => {
        router.back();
    };

    return (
        <GradientBackground>
            <View className="flex-1 justify-center items-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
                <View className="w-full max-w-[420px]">
                    <AppLogo/>

                    <AuthHeader
                        title="Tạo tài khoản mới"
                        subtitle={'Đăng ký để trải nghiệm những tính năng\ntuyệt vời cùng bạn bè'}
                    />

                    <View className="space-y-4 sm:space-y-5">
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
                            className="mt-4"
                        />

                        <TextLink
                            text="Đã có tài khoản?"
                            linkText="Đăng nhập ngay"
                            onPress={handleLogin}
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
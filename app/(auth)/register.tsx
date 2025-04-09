import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity, Modal} from 'react-native';
import {useRouter} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from '@/src/components/ui/Toast';
import GradientBackground from '@/src/components/auth/GradientBackground';
import AppLogo from '@/src/components/auth/AppLogo';
import AuthHeader from '@/src/components/auth/AuthHeader';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import TextLink from '@/src/components/ui/TextLink';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Register() {
    // Value
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    // State
    const [loading, setLoading] = useState(false);

    // Toast
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    // Router
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const getGenderLabel = (value: string) => {
        switch(value) {
            case 'male': return 'Nam';
            case 'female': return 'Nữ';
            case 'other': return 'Khác';
            default: return 'Chọn giới tính';
        }
    };

    // Validate form
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
        if (!email) {
            setToast({
                visible: true,
                message: 'Vui lòng nhập email',
                type: 'error'
            });
            return false;
        }
        if (!email.includes('@')) {
            setToast({
                visible: true,
                message: 'Email không hợp lệ',
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

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDob(selectedDate);
        }
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
                            <AppLogo/>

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
                                        icon="mail-outline"
                                        placeholder="Email"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        editable={!loading}
                                    />

                                    {Platform.OS === 'web' ? (
                                        <View className="border border-gray-300 rounded-lg px-4 py-3">
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                                                className="w-full bg-transparent outline-none text-base"
                                                disabled={loading}
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </View>
                                    ) : Platform.select({
                                        native: (
                                            <>
                                                <TouchableOpacity 
                                                    onPress={() => setShowGenderPicker(true)}
                                                    className="bg-white border border-gray-300 rounded-lg h-14 justify-center px-4"
                                                >
                                                    <Text className="text-base text-black">
                                                        {getGenderLabel(gender)}
                                                    </Text>
                                                </TouchableOpacity>

                                                <Modal
                                                    visible={showGenderPicker}
                                                    transparent={true}
                                                    animationType="slide"
                                                >
                                                    <View className="flex-1 justify-end bg-black/50">
                                                        <View className="bg-white w-full p-4">
                                                            <View className="flex-row justify-between items-center mb-4">
                                                                <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                                                                    <Text className="text-blue-500 text-lg">Hủy</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity onPress={() => setShowGenderPicker(false)}>
                                                                    <Text className="text-blue-500 text-lg">Xong</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <Picker
                                                                selectedValue={gender}
                                                                onValueChange={(value: 'male' | 'female' | 'other') => setGender(value)}
                                                                enabled={!loading}
                                                            >
                                                                <Picker.Item label="Nam" value="male" color='black' />
                                                                <Picker.Item label="Nữ" value="female" color='black' />
                                                                <Picker.Item label="Khác" value="other" color='black' />
                                                            </Picker>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </>
                                        ),
                                        default: null
                                    })}

                                    {Platform.OS === 'web' ? (
                                        <View className="border border-gray-300 rounded-lg px-4 py-3">
                                            <input
                                                type="date"
                                                value={dob.toISOString().split('T')[0]}
                                                onChange={(e) => setDob(new Date(e.target.value))}
                                                className="w-full bg-transparent outline-none text-base"
                                                disabled={loading}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </View>
                                    ) : (
                                        <TouchableOpacity 
                                        onPress={() => setShowDatePicker(true)}
                                        className="bg-white border border-gray-300 rounded-lg h-14 justify-center px-4 relative"
                                    >
                                        <Text className="text-base text-black">{dob.toLocaleDateString('vi-VN')}</Text>
                                        <View className="absolute inset-0 justify-center items-center">
                                        {showDatePicker && (
                                            <DateTimePicker
                                                value={dob}
                                                mode="date"
                                                display="default"
                                                onChange={handleDateChange}
                                                maximumDate={new Date()}
                                            />
                                        )}
                                        </View>
                                    </TouchableOpacity>
                                    )}

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
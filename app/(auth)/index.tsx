import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from '../components/Toast';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const isMediumScreen = width >= 380 && width < 768;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gradient-to-b from-blue-50 to-white"
    >
      <ScrollView 
        className="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-4 py-8 sm:px-6 md:px-8 lg:px-10">
          <View className="w-full max-w-[420px]">
            {/* Logo */}
            <View className="items-center mb-6">
              <View className="bg-white rounded-2xl shadow-sm p-2">
                <Image
                  source={require('../../assets/telegram-logo.png')}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Title */}
            <View className="mb-6">
              <Text className="text-2xl font-bold text-gray-800 text-center mb-2">
                Welcome Back!
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-relaxed">
                Đăng nhập để kết nối với bạn bè và{'\n'}
                người thân của bạn
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4 sm:space-y-5">
              {/* Username Input */}
              <View className="bg-white shadow-sm border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:border-blue-200">
                <View className="flex-row items-center px-3 sm:px-4">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 text-gray-800 text-sm sm:text-base"
                    placeholder="Số điện thoại hoặc email"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="bg-white shadow-sm border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:border-blue-200">
                <View className="flex-row items-center px-3 sm:px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 text-gray-800 text-sm sm:text-base"
                    placeholder="Mật khẩu"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                    className="p-2"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                className="self-end"
                activeOpacity={0.6}
              >
                <Text className="text-blue-500 font-medium text-xs sm:text-sm">
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                className={`h-[48px] sm:h-[56px] rounded-xl sm:rounded-2xl items-center justify-center mt-4 shadow-sm ${
                  loading 
                    ? 'bg-blue-400' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Đăng nhập
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-5 sm:my-6">
                <View className="flex-1 h-[1px] bg-gray-200" />
                <Text className="mx-3 sm:mx-4 text-gray-400 font-medium text-xs sm:text-sm">Hoặc</Text>
                <View className="flex-1 h-[1px] bg-gray-200" />
              </View>

              {/* QR Code Login */}
              <TouchableOpacity 
                className="h-[48px] sm:h-[56px] rounded-xl sm:rounded-2xl border-2 border-blue-500 items-center justify-center flex-row space-x-2"
                activeOpacity={0.7}
              >
                <Ionicons name="qr-code-outline" size={20} color="#3B82F6" />
                <Text className="text-blue-500 font-semibold text-sm sm:text-base">
                  Đăng nhập bằng mã QR
                </Text>
              </TouchableOpacity>

              {/* Register Link */}
              <View className="flex-row justify-center items-center mt-6 sm:mt-8">
                <Text className="text-gray-600 text-sm sm:text-base">
                  Chưa có tài khoản?
                </Text>
                <TouchableOpacity 
                  onPress={handleRegister}
                  activeOpacity={0.6}
                  className="ml-1"
                >
                  <Text className="text-blue-500 font-semibold text-sm sm:text-base">
                    Đăng ký ngay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
} 
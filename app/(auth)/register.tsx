import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from '../components/Toast';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 380;
  const isMediumScreen = width >= 380 && width < 768;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
                Tạo tài khoản mới
              </Text>
              <Text className="text-sm text-gray-600 text-center leading-relaxed">
                Đăng ký để trải nghiệm những tính năng{'\n'}
                tuyệt vời cùng bạn bè
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4 sm:space-y-5">
              {/* Phone Input */}
              <View className="bg-white shadow-sm border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:border-blue-200">
                <View className="flex-row items-center px-3 sm:px-4">
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 text-gray-800 text-sm sm:text-base"
                    placeholder="Số điện thoại"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Name Input */}
              <View className="bg-white shadow-sm border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:border-blue-200">
                <View className="flex-row items-center px-3 sm:px-4">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 text-gray-800 text-sm sm:text-base"
                    placeholder="Họ và tên"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#9CA3AF"
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

              {/* Confirm Password Input */}
              <View className="bg-white shadow-sm border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200 focus-within:shadow-md focus-within:border-blue-200">
                <View className="flex-row items-center px-3 sm:px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 h-[48px] sm:h-[56px] ml-2 sm:ml-3 text-gray-800 text-sm sm:text-base"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                    className="p-2"
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className={`h-[48px] sm:h-[56px] rounded-xl sm:rounded-2xl items-center justify-center mt-4 shadow-sm ${
                  loading 
                    ? 'bg-blue-400' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-semibold text-base sm:text-lg">
                    Đăng ký
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View className="flex-row justify-center items-center mt-6 sm:mt-8">
                <Text className="text-gray-600 text-sm sm:text-base">
                  Đã có tài khoản?
                </Text>
                <TouchableOpacity 
                  onPress={handleLogin}
                  activeOpacity={0.6}
                  className="ml-1"
                >
                  <Text className="text-blue-500 font-semibold text-sm sm:text-base">
                    Đăng nhập ngay
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
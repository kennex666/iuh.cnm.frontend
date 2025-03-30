import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BackgroundImage = () => (
  <View className="absolute right-0 top-0 w-full h-full overflow-hidden">
    <Image
      source={require('../../assets/telegram-logo.png')}
      className="absolute right-[-20%] top-[-10%]"
      style={{
        width: SCREEN_WIDTH * 1.2,
        height: SCREEN_WIDTH * 1.2,
        opacity: 0.1,
      }}
      resizeMode="contain"
    />
  </View>
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login with:', username, password);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <BackgroundImage />
      <ScrollView 
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-4 sm:px-6 md:px-8 max-w-md mx-auto w-full py-8">
          {/* Logo */}
          <View className="mb-6">
            <Image
              source={require('../../assets/telegram-logo.png')}
              style={{
                width: Math.min(SCREEN_WIDTH * 0.2, 120),
                height: Math.min(SCREEN_WIDTH * 0.2, 120),
              }}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <View className="w-full text-center mb-8">
            <Text className="text-[22px] sm:text-2xl md:text-3xl font-semibold text-center mb-2">
              Đăng nhập Zalo
            </Text>
            <Text className="text-gray-500 text-[15px] sm:text-base text-center leading-5">
              Vui lòng nhập số điện thoại và mật khẩu{'\n'}
              để đăng nhập Zalo của bạn
            </Text>
          </View>

          {/* Form */}
          <View className="w-full space-y-4 max-w-[400px]">
            <View className="bg-white rounded-md shadow-sm">
              <TextInput
                className="w-full h-[52px] bg-white border border-gray-200 rounded-md px-4 text-base"
                placeholder="Số điện thoại"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
            </View>

            <View className="bg-white rounded-md shadow-sm">
              <TextInput
                className="w-full h-[52px] bg-white border border-gray-200 rounded-md px-4 text-base"
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              className="w-full h-[52px] bg-[#3390EC] rounded-md items-center justify-center"
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text className="text-white text-[15px] sm:text-base font-medium">
                ĐĂNG NHẬP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="mt-4"
              activeOpacity={0.6}
            >
              <Text className="text-[#3390EC] text-[15px] sm:text-base text-center font-medium">
                QUÉT MÃ QR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login; 
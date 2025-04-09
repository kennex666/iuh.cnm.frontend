import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/contexts/userContext';
import { router } from 'expo-router';
import ChangePasswordModal from './ChangePasswordModal';
import TwoFactorAuthModal from './TwoFactorAuthModal';
import DeviceAccessModal from './DeviceAccessModal';

export default function SettingsDesktop() {
  const { logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);
  const [showDeviceAccess, setShowDeviceAccess] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <View className="py-6">
            <Text className="text-2xl font-bold text-gray-900">Cài đặt</Text>
          </View>
        </View>
      </View>

      <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <View className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <View className="w-full md:w-64 bg-white rounded-lg shadow-sm p-4 h-fit">
            <Text className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Danh mục
            </Text>
            <View className="space-y-1">
              <TouchableOpacity 
                className="flex-row items-center p-3 rounded-md bg-blue-50"
              >
                <Ionicons name="shield-checkmark-outline" size={20} color="#3B82F6" />
                <Text className="ml-3 text-blue-700 font-medium">Bảo mật</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center p-3 rounded-md hover:bg-gray-50"
              >
                <Ionicons name="phone-portrait-outline" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700">Thiết bị</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center p-3 rounded-md hover:bg-gray-50"
              >
                <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700">Thông báo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-row items-center p-3 rounded-md hover:bg-gray-50"
              >
                <Ionicons name="language-outline" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700">Ngôn ngữ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Content */}
          <View className="flex-1">
            <View className="bg-white rounded-lg shadow-sm p-6">
              <Text className="text-xl font-semibold text-gray-900 mb-6">Bảo mật</Text>
              
              <View className="space-y-6">
                {/* Password Section */}
                <View className="border-b border-gray-200 pb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className="text-lg font-medium text-gray-900">Mật khẩu</Text>
                      <Text className="text-sm text-gray-500">Cập nhật mật khẩu của bạn</Text>
                    </View>
                    <TouchableOpacity 
                      className="px-4 py-2 bg-blue-50 rounded-md"
                      onPress={() => setShowChangePassword(true)}
                    >
                      <Text className="text-blue-700 font-medium">Đổi mật khẩu</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2FA Section */}
                <View className="border-b border-gray-200 pb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className="text-lg font-medium text-gray-900">Xác thực 2 lớp</Text>
                      <Text className="text-sm text-gray-500">Bảo vệ tài khoản bằng xác thực 2 lớp</Text>
                    </View>
                    <TouchableOpacity 
                      className="px-4 py-2 bg-blue-50 rounded-md"
                      onPress={() => setShowTwoFactorAuth(true)}
                    >
                      <Text className="text-blue-700 font-medium">Cài đặt</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Device Access Section */}
                <View className="border-b border-gray-200 pb-6">
                  <View className="flex-row justify-between items-center mb-4">
                    <View>
                      <Text className="text-lg font-medium text-gray-900">Quản lý thiết bị</Text>
                      <Text className="text-sm text-gray-500">Xem và quản lý các thiết bị đã đăng nhập</Text>
                    </View>
                    <TouchableOpacity 
                      className="px-4 py-2 bg-blue-50 rounded-md"
                      onPress={() => setShowDeviceAccess(true)}
                    >
                      <Text className="text-blue-700 font-medium">Quản lý</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Logout Section */}
                <View>
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-lg font-medium text-gray-900">Đăng xuất</Text>
                      <Text className="text-sm text-gray-500">Đăng xuất khỏi tất cả thiết bị</Text>
                    </View>
                    <TouchableOpacity 
                      className="px-4 py-2 bg-red-50 rounded-md"
                      onPress={handleLogout}
                    >
                      <Text className="text-red-700 font-medium">Đăng xuất</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ChangePasswordModal 
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <TwoFactorAuthModal
        visible={showTwoFactorAuth}
        onClose={() => setShowTwoFactorAuth(false)}
      />

      <DeviceAccessModal
        visible={showDeviceAccess}
        onClose={() => setShowDeviceAccess(false)}
      />
    </View>
  );
} 
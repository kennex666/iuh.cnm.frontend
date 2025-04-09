import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '@/src/contexts/userContext';
import { router } from 'expo-router';
import ChangePasswordModal from './ChangePasswordModal';
import TwoFactorAuthModal from './TwoFactorAuthModal';

export default function SettingsMobile() {
  const { logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="border-b border-gray-200">
        <View className="flex-row items-center p-4">
          <Text className="text-xl font-semibold">Cài đặt</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Security Section */}
        <View className="p-4 space-y-4">
          <Text className="text-lg font-semibold text-gray-800">Bảo mật</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            onPress={() => setShowChangePassword(true)}
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name="lock-closed-outline" size={24} color="#4B5563" />
              <Text className="text-base text-gray-700">Đổi mật khẩu</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            onPress={() => setShowTwoFactorAuth(true)}
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name="shield-checkmark-outline" size={24} color="#4B5563" />
              <Text className="text-base text-gray-700">Bảo mật 2 lớp</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Access Section */}
        <View className="p-4 space-y-4">
          <Text className="text-lg font-semibold text-gray-800">Truy cập</Text>
          
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            onPress={handleLogout}
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text className="text-base text-red-500">Đăng xuất</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ChangePasswordModal 
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />

      <TwoFactorAuthModal
        visible={showTwoFactorAuth}
        onClose={() => setShowTwoFactorAuth(false)}
      />
    </View>
  );
}

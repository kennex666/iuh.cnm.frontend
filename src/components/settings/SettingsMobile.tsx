import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '@/src/contexts/userContext';
import { router } from 'expo-router';
import ChangePasswordModal from './ChangePasswordModal';

export default function SettingsMobile() {
  const { logout } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <ScrollView className="flex-1 p-4">
        <View className="space-y-4">
          {/* Security Settings */}
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800">
                Bảo mật
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              onPress={() => setShowChangePassword(true)}
            >
              <Ionicons name="lock-closed-outline" size={24} color="#4B5563" />
              <Text className="ml-3 text-gray-700 text-base flex-1">
                Đổi mật khẩu
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center p-4 border-b border-gray-100"
              onPress={() => {}}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#4B5563"
              />
              <Text className="ml-3 text-gray-700 text-base flex-1">
                Bảo mật 2 lớp
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Access Settings */}
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-4">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800">
                Truy cập
              </Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center p-4"
              onPress={() => {}}
            >
              <Ionicons name="key-outline" size={24} color="#4B5563" />
              <Text className="ml-3 text-gray-700 text-base flex-1">
                Quản lý thiết bị
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center p-4 bg-red-50 rounded-xl mt-4"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text className="ml-2 text-red-500 text-base font-medium">
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ChangePasswordModal 
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}

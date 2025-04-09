import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '@/src/components/ui/FormInput';
import Toast from '@/src/components/ui/Toast';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setToast({
        visible: true,
        message: 'Vui lòng điền đầy đủ thông tin',
        type: 'error'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        visible: true,
        message: 'Mật khẩu mới không khớp',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setToast({
        visible: true,
        message: 'Đổi mật khẩu thành công',
        type: 'success'
      });
      
      // Reset form and close modal after success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setToast({
        visible: true,
        message: 'Có lỗi xảy ra, vui lòng thử lại',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-end bg-black/50">
            <View className="bg-white rounded-t-3xl">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                <TouchableOpacity onPress={onClose}>
                  <Text className="text-blue-500 text-lg">Hủy</Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Đổi mật khẩu</Text>
                <TouchableOpacity onPress={handleChangePassword} disabled={loading}>
                  <Text className="text-blue-500 text-lg">Xong</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                className="p-4"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View className="space-y-4">
                  <FormInput
                    icon="lock-closed-outline"
                    placeholder="Mật khẩu hiện tại"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                    showTogglePassword
                    editable={!loading}
                  />

                  <FormInput
                    icon="lock-closed-outline"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    showTogglePassword
                    editable={!loading}
                  />

                  <FormInput
                    icon="lock-closed-outline"
                    placeholder="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    showTogglePassword
                    editable={!loading}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({...prev, visible: false}))}
      />
    </>
  );
} 
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormInput from '@/src/components/ui/FormInput';
import Toast from '@/src/components/ui/Toast';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'current' | 'otp' | 'new'>('current');
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  const handleSendOTP = async () => {
    if (!currentPassword) {
      setToast({
        visible: true,
        message: 'Vui lòng nhập mật khẩu hiện tại',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setToast({
        visible: true,
        message: 'Mã OTP đã được gửi đến email của bạn',
        type: 'success'
      });
      
      setStep('otp');
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

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      setToast({
        visible: true,
        message: 'Vui lòng nhập mã OTP',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to verify OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setToast({
        visible: true,
        message: 'Xác thực OTP thành công',
        type: 'success'
      });
      
      setStep('new');
    } catch (error) {
      setToast({
        visible: true,
        message: 'Mã OTP không đúng, vui lòng thử lại',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
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
      
      setCurrentPassword('');
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
      setStep('current');
      
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

  const renderStepContent = () => {
    switch (step) {
      case 'current':
        return (
          <View className="p-6 space-y-6">
            <FormInput
              icon="lock-closed-outline"
              placeholder="Mật khẩu hiện tại"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity 
              className="bg-blue-500 p-3 rounded-lg"
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-medium">
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'otp':
        return (
          <View className="p-6 space-y-6">
            <FormInput
              icon="key-outline"
              placeholder="Nhập mã OTP"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="numeric"
              editable={!loading}
            />
            <TouchableOpacity 
              className="bg-blue-500 p-3 rounded-lg"
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              <Text className="text-white text-center font-medium">
                {loading ? 'Đang xác thực...' : 'Xác thực'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'new':
        return (
          <View className="p-6 space-y-6">
            <FormInput
              icon="lock-closed-outline"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!loading}
            />
            <FormInput
              icon="lock-closed-outline"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />
            <TouchableOpacity 
              className="bg-blue-500 p-3 rounded-lg"
              onPress={handleChangePassword}
              disabled={loading}
            >
              <Text className="text-white text-center font-medium">
                {loading ? 'Đang xử lý...' : 'Lưu mật khẩu mới'}
              </Text>
            </TouchableOpacity>
          </View>
        );
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
          <View className="flex-1 justify-center bg-black/50">
            <View className="bg-white rounded-3xl mx-4 mt-[-100px]">
              <View className="flex-row justify-between items-center p-4 border-b border-gray-100">
                <TouchableOpacity onPress={onClose}>
                  <Text className="text-blue-500 text-lg">Hủy</Text>
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Đổi mật khẩu</Text>
                <View style={{ width: 40 }} />
              </View>

              {renderStepContent()}
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
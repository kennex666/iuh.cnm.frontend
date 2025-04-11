import React, { useEffect, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from '@/src/components/ui/Toast';
import FormInput from '@/src/components/ui/FormInput';
import Button from '@/src/components/ui/Button';
import QRCodeDisplay from '../ui/QRCodeDisplay';
import { Domains } from '@/src/constants/ApiConstant';
import { authService } from '@/src/api/services/authService';

interface TwoFactorAuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TwoFactorAuthModal({ visible, onClose }: TwoFactorAuthModalProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(''); // Placeholder for content
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error'
  });

  useEffect(() => {
     fetch(Domains.API_2FA + '/generate').then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setContent(data.base32 || "null"); // Assuming the API returns a JSON object with a 'content' field
        });
      } else {
        console.error('Failed to fetch content');
      }}).catch((error) => {
        console.error('Error fetching content:', error);
      });
  }, []);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await authService.get2FAStatus();
        if (response.success) {
          setIsEnabled(true);
        } else {
          setIsEnabled(false);
        }
      } catch (error) {
        console.error('Error fetching 2FA status:', error);
      }
    };

    fetch2FAStatus();
  }, []);

  const handleToggle2FA = async () => {
    setShowVerification(true);
  };

  const handleVerifyAndToggle = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setToast({
        visible: true,
        message: 'Vui lòng nhập mã xác thực 6 số',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement API call to verify 2FA code and toggle 2FA
      const result = !isEnabled ? await authService.enable2FA({ secret: content, otp: verificationCode }) : await authService.disable2FA({ otp: verificationCode });
      
      if (!result.success) {
        setToast({
          visible: true,
          message: 'Mã xác thực không hợp lệ',
          type: 'error'
        });
        return;
      }
      // If the API call is successful, toggle the 2FA state
      setIsEnabled(!isEnabled);
      setToast({
        visible: true,
        message: isEnabled ? 'Đã tắt bảo mật 2 lớp' : 'Đã bật bảo mật 2 lớp',
        type: 'success'
      });
      
      setShowVerification(false);
      setVerificationCode('');
      
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

  const handleCancelVerification = () => {
    setShowVerification(false);
    setVerificationCode('');
  };

  return (
		<>
			<Modal visible={visible} transparent={true} animationType="slide">
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1"
				>
					<View className="flex-1 justify-center bg-black/50">
						<View className="bg-white rounded-3xl mx-4">
							<View className="flex-row justify-between items-center p-4 border-b border-gray-100">
								<TouchableOpacity onPress={onClose}>
									<Text className="text-blue-500 text-lg">
										Hủy
									</Text>
								</TouchableOpacity>
								<Text className="text-lg font-semibold">
									Bảo mật 2 lớp
								</Text>
								<View style={{ width: 40 }} />
							</View>

							{!showVerification ? (
								<View className="p-4 space-y-6">
									<View className="flex-row items-center justify-between">
										<Text className="text-base text-gray-700">
											Trạng thái
										</Text>
										<TouchableOpacity
											onPress={handleToggle2FA}
											disabled={loading}
											className={`w-14 h-8 rounded-full ${
												isEnabled
													? "bg-blue-500"
													: "bg-gray-300"
											} p-1`}
										>
											<View
												className={`w-6 h-6 rounded-full bg-white shadow transform transition-transform ${
													isEnabled
														? "translate-x-6"
														: "translate-x-0"
												}`}
											/>
										</TouchableOpacity>
									</View>

									<Text className="text-sm text-gray-500">
										{isEnabled
											? "Bảo mật 2 lớp đang được bật. Tắt tính năng này sẽ giảm bảo mật cho tài khoản của bạn."
											: "Bật bảo mật 2 lớp để tăng cường bảo mật cho tài khoản của bạn."}
									</Text>
								</View>
							) : (
								<View className="p-4 space-y-6">
									{!isEnabled ? (
										<View>
											<QRCodeDisplay
												value={"otpauth://totp/iMessify?secret=" + content}
												size={150}
											/>
										</View>
									) : null}
									<Text className="text-base text-gray-700 text-center">
										{isEnabled
											? "Nhập mã xác thực 2FA để tắt tính năng này"
											: "Sử dụng Google Authenticator hoặc ứng dụng tương tự để quét mã QR và nhận mã xác thực 2FA.\n\nKey: " + content}
									</Text>

									<FormInput
										icon="key-outline"
										placeholder="Mã xác thực 2FA"
										value={verificationCode}
										onChangeText={(text) =>
											setVerificationCode(
												text.slice(0, 6)
											)
										}
										editable={!loading}
										keyboardType="numeric"
									/>

									<View className="flex-row space-x-3">
										<Button
											title="Hủy"
											onPress={handleCancelVerification}
											variant="outline"
											className="flex-1"
										/>
										<Button
											title="Xác nhận"
											onPress={handleVerifyAndToggle}
											loading={loading}
											className="flex-1"
										/>
									</View>
								</View>
							)}
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			<Toast
				visible={toast.visible}
				message={toast.message}
				type={toast.type}
				onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
			/>
		</>
  );
} 
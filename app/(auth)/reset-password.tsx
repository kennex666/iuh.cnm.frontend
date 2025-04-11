import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FormInput from "@/src/components/ui/FormInput";
import Toast from "@/src/components/ui/Toast";
import GradientBackground from "@/src/components/auth/GradientBackground";
import AppLogo from "@/src/components/auth/AppLogo";
import AuthHeader from "@/src/components/auth/AuthHeader";
import Button from "@/src/components/ui/Button";
import { authService } from "@/src/api/services/AuthService";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" as "success" | "error",
  });
  const insets = useSafeAreaInsets();

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const params = useLocalSearchParams();

  useEffect(() => {
    if (params.phone) {
      setPhone(params.phone as string);
    } else {
      // Xử lý khi không có phone
      setToast({
        visible: true,
        message: "Không tìm thấy thông tin số điện thoại",
        type: "error",
      });
      setTimeout(() => router.back(), 1500);
    }
    console.log("Phone number from params:", phone);
  }, [params?.phone]);

  useEffect(() => {
    if (params.otp) {
      setOtp(params.otp as string);
    } else {
      // Xử lý khi không có phone
      setToast({
        visible: true,
        message: "Không tìm thấy OTP",
        type: "error",
      });
      setTimeout(() => router.back(), 1500);
    }
    console.log("OTP from params:", otp);
  }, [params?.otp]);

  const validateForm = () => {
    if (!newPassword || !confirmPassword) {
      setToast({
        visible: true,
        message: "Vui lòng điền đầy đủ thông tin",
        type: "error",
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      setToast({
        visible: true,
        message: "Mật khẩu mới không khớp",
        type: "error",
      });
      return false;
    }

    if (newPassword.length < 6) {
      setToast({
        visible: true,
        message: "Mật khẩu phải có ít nhất 6 ký tự",
        type: "error",
      });
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Implement API call to reset password with token
      const result = await authService.forgotPassword({
        phone,
        otp,
        password: newPassword,
      });

      if (!result.success) {
        setToast({
          visible: true,
          message: result.message || "Có lỗi xảy ra, vui lòng thử lại",
          type: "error",
        });
        return;
      }

      setToast({
        visible: true,
        message: "Đặt lại mật khẩu thành công",
        type: "success",
      });

      setTimeout(() => {
        router.replace("/");
      }, 1500);
    } catch (error) {
      setToast({
        visible: true,
        message: "Có lỗi xảy ra, vui lòng thử lại",
        type: "error",
      });
      console.error("Reset password error:", error);
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
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="flex-1 justify-end items-center px-4 pb-6"
            style={{ paddingTop: Math.max(insets.top, 20) }}
          >
            <View className="w-full max-w-[100%] sm:max-w-[420px]">
              <AppLogo />

              <View className="mt-4">
                <AuthHeader
                  title="Đặt lại mật khẩu"
                  subtitle={`Nhập mật khẩu mới cho tài khoản ${phone}`}
                />

                <View className="mt-4 space-y-3">
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

                  <Text className="text-sm text-gray-500 mt-2">
                    Mật khẩu phải có ít nhất 8 ký tự và bao gồm chữ, số và ký tự
                    đặc biệt
                  </Text>

                  <Button
                    title="Đặt lại mật khẩu"
                    onPress={handleResetPassword}
                    loading={loading}
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
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </GradientBackground>
  );
}

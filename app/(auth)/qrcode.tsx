import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { shadows } from "@/src/styles/shadow";
import QRCode from "@/src/components/ui/QRCode";

export default function QrCode() {
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Trở về
  const handleClose = () => {
    router.back();
  };
  // Giả lập xử lý quét mã QR
  const handleScan = (data: string) => {
    setLoading(true);
    try {
      // Giả lập xử lý dữ liệu quét được
      console.log("Scanned data:", data);

      // Giả lập đăng nhập thành công sau 2 giây
      setTimeout(() => {
        setLoading(false);
        router.replace("/(main)");
      }, 2000);
    } catch (error) {
      console.error("Error processing QR code:", error);
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
        style={shadows.sm}
      >
        <TouchableOpacity onPress={handleClose}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">
          {showScanner ? "Quét mã QR" : "Mã QR đăng nhập"}
        </Text>
        <TouchableOpacity onPress={() => setShowScanner(!showScanner)}>
          <Ionicons
            name={showScanner ? "qr-code-outline" : "scan-outline"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0068FF" />
          <Text className="mt-4 text-gray-500">Đang xử lý...</Text>
        </View>
      ) : showScanner ? (
        <View>
          <Text className="text-center text-gray-500 mt-4">
            Quét mã QR để đăng nhập
          </Text>
          <QRCode onClose={handleClose} />
        </View>
      ) : (
        <View>
          <Text className="text-center text-gray-500 mt-4">
            Chờ quét mã QR từ thiết bị khác
          </Text>
          <Text className="text-center text-gray-500 mt-2">
            Hoặc nhập mã QR bằng tay
          </Text>
        </View>
      )}
    </View>
  );
}

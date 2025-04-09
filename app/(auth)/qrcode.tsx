import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { shadows } from "@/src/styles/shadow";
import Loading from "@/src/components/loading/loading";
import QRCodeDisplay from "@/src/components/ui/QRCodeDisplay";

export default function QrCode() {
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrValue, setQrValue] = useState("https://ngthluan.io.vn/");

  // Router
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
          {Platform.OS === 'web' ? "Mã QR đăng nhập" :  "Quét mã QR"}
        </Text>
        <TouchableOpacity onPress={() => setShowScanner(!showScanner)}>
          <Ionicons
            name={Platform.OS === 'web' ? "qr-code-outline" : "scan-outline"}
            size={24}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : Platform.OS === "web" ? (
        // Chờ quét mã QR từ thiết bị khác
        <View className="flex-1 items-center justify-center p-6">
          <View className="">
            {/* Phần tiêu đề */}
            <View className="mb-6">
              <Text className="text-center text-xl font-bold text-gray-800 mb-2">
                Mã QR đăng nhập
              </Text>
              <Text className="text-center text-sm text-gray-500">
                Sử dụng thiết bị khác để quét mã này
              </Text>
            </View>
          </View>
          {/* Phần QR code */}
          <View className="bg-white p-4 rounded-2xl border-2 border-gray-100">
            <QRCodeDisplay 
              value={qrValue}
              size={256}
            />
          </View>
          {/* Thông tin bổ sung */}
          <View className="mt-6">
            <Text className="text-center text-sm text-gray-500">
              Mã QR sẽ tự động làm mới sau
            </Text>
            <Text className="text-center text-lg font-semibold text-blue-500">
              04:59
            </Text>
          </View>
          {/* Nút làm mới */}
          <TouchableOpacity
            className="mt-6 bg-blue-500 py-3 px-6 rounded-full"
            onPress={() => {
              /* handle refresh */
            }}
          >
            <Text className="text-white text-center font-semibold">
              Tạo mã QR mới
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Mở camera để quét mã QR
        <View className="flex-1">
          {/* Overlay hướng dẫn */}
          <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
            {/* Khung quét */}
            <View className="w-72 h-72 border-2 border-white rounded-lg">
              <View className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-blue-500" />
              <View className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-blue-500" />
              <View className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-blue-500" />
              <View className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-blue-500" />
            </View>

            {/* Hướng dẫn */}
            <View className="absolute bottom-20 left-0 right-0 items-center">
              <View className="bg-black/50 px-6 py-4 rounded-2xl">
                <Text className="text-white text-center text-base">
                  Đặt mã QR vào khung hình để quét
                </Text>
              </View>
            </View>
          </View>

          {/* Nút bật/tắt đèn flash */}
          <TouchableOpacity
            className="absolute top-6 right-6 bg-black/30 p-3 rounded-full"
            onPress={() => {
             
            }}
          >
            <Ionicons name="flash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

import React, {useState} from "react";
import {ActivityIndicator, Platform, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import {Shadows} from "@/src/styles/Shadow";
import QRCodeDisplay from "@/src/components/ui/QRCodeDisplay";
import QRScanner from "@/src/components/ui/QRScanner";

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
            console.log("Scanned data:", data);
            // Xử lý dữ liệu QR ở đây

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
        <View className="flex-1 bg-white" style={{paddingTop: insets.top}}>
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
                style={Shadows.sm}
            >
                <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="arrow-back" size={24} color="#333"/>
                </TouchableOpacity>
                <Text className="text-lg font-semibold text-gray-800">
                    {Platform.OS === 'web' ? "Mã QR đăng nhập" : "Quét mã QR"}
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
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0068FF"/>
                    <Text className="mt-4 text-gray-500">Đang xử lý...</Text>
                </View>
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
                // Màn hình quét mã QR
                <QRScanner/>
            )}
        </View>
    );
}

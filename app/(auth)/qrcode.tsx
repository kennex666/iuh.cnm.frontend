import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Shadows } from "@/src/styles/Shadow";
import QRCodeDisplay from "@/src/components/ui/QRCodeDisplay";
import QRScanner from "@/src/components/ui/QRScanner";
import { io, Socket } from "socket.io-client";
import { URL_BE } from "@/src/constants/ApiConstant";
import { useUser } from "@/src/contexts/user/UserContext";


export default function QrCode() {
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, loginQR } = useUser(); // Assuming you have a loginQR function in your UserContext
  
  
useEffect(() => {
  if (Platform.OS === "web" && user && isAuthenticated) {
    router.replace("/(main)");
  }
}, [user, isAuthenticated]);

useEffect(() => {
  const socket: Socket = io(`${URL_BE}/skloginQR`, {
    transports: ["websocket"],
  });

  const handleGenerateQrCode = (data: {
		data: { deviceCode: string; socketId: string };
	}) => {
		console.log("QR code data received:", data);
		const { deviceCode } = data.data;
		setQrValue(deviceCode);
		setLoading(false);
		setError(null);
	};

	const handleError = (error: { message: string }) => {
		console.error("Socket error:", error.message);
		setError(error.message);
		setLoading(false);
	};
  if (Platform.OS === "web"){

    socket.on("loginQR:generate", handleGenerateQrCode);
    socket.on("connect_error", (err) => handleError({ message: err.message }));
    socket.on("loginQR:verified", (data) => {
      console.log("Đã xác thực đăng nhập bằng QR:", data);

      if (data?.errorCode === 200) {
        // Có thể lưu token, điều hướng, hoặc hiển thị thông báo thành công ở đây
        loginQR(data);
      } else {
        setError("Đăng nhập bằng QR thất bại");
      }
    });
    socket.emit("loginQR:generate");

    // Cleanup

  }
	
  return () => {
		socket.off("generate_login_qr", handleGenerateQrCode);
		socket.disconnect();
	};
}, []);

  // Router
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.back();
  };

  const handleScanToggle = () => {
    setShowScanner(!showScanner);
  };

  return (
		<View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
			{/* Header */}
			<View
				className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
				style={Shadows.sm}
			>
				<TouchableOpacity onPress={handleClose}>
					<Ionicons name="arrow-back" size={24} color="#333" />
				</TouchableOpacity>
				<Text className="text-lg font-semibold text-gray-800">
					{Platform.OS === "web" ? "Đăng nhập bằng QR" : "Quét mã QR"}
				</Text>
				<TouchableOpacity onPress={handleScanToggle}>
					<Ionicons
						name={
							Platform.OS === "web"
								? "qr-code-outline"
								: "scan-outline"
						}
						size={24}
						color="#333"
					/>
				</TouchableOpacity>
			</View>

			{/* Content */}
			{loading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#0068FF" />
					<Text className="mt-4 text-gray-500">
						Đang tạo mã QR...
					</Text>
				</View>
			) : error ? (
				<View className="flex-1 items-center justify-center p-6">
					<Text className="text-red-500 text-center mb-4">
						{error}
					</Text>
					<TouchableOpacity
						onPress={() => {
							setLoading(true);
							setError(null);
							// Trick: trigger lại useEffect bằng cách đổi key
							// hoặc đơn giản dùng window.location.reload() nếu là web
							window.location.reload(); // chỉ dùng trên web
						}}
						className="bg-blue-500 px-6 py-3 rounded-lg"
					>
						<Text className="text-white font-semibold">
							Thử lại
						</Text>
					</TouchableOpacity>
				</View>
			) : Platform.OS === "web" ? (
				// QR Code display for web
				<View className="flex-1 items-center justify-center p-6">
					<View className="bg-white p-4 rounded-2xl border-2 border-gray-100">
						<QRCodeDisplay value={qrValue} size={256} />
					</View>
					<View className="mt-4 w-full max-w-[300px]">
						<View className="mb-6">
							<Text className="text-center text-xl font-bold text-gray-800 mb-2">
								Mã QR đăng nhập
							</Text>
							<Text className="text-center text-sm text-gray-500">
								Sử dụng ứng dụng trên điện thoại để quét mã này
							</Text>
						</View>
					</View>
				</View>
			) : (
				// QR Scanner for mobile
				<QRScanner
					onScan={(data) => {
						console.log("Scanned QR code:", data);
						// TODO: Handle QR code scan result
					}}
				/>
			)}
		</View>
  );
}

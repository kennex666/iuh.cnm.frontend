import { useUser } from "@/src/contexts/user/UserContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

type MiniAppWrapperProps = {
	app: {
		app_name: string;
		description: string;
		icon: string;
		url: string;
	};
};

const translatePermission = {
	"phone": "số điện thoại",
	"name": "tên",
	"location": "vị trí",
	"camera": "máy ảnh",
	"microphone": "microphone",
	"contacts": "danh bạ",
	"storage": "bộ nhớ",
	"unknown": "quyền không xác định"
};

const MiniAppWrapper: React.FC<MiniAppWrapperProps> = () => {
	const webViewRef = useRef(null);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isRequireAccept, setIsRequireAccept] = useState(true);
	const [isThirdpartyRequire, setIsThirdpartyRequire] = useState("");

	const { user, isAuthenticated } = useUser();

	
	const params = useLocalSearchParams();

	const app = {
		id: params.id as string,
		app_name: params.app_name as string,
		description: params.description as string,
		icon: params.icon as string,
		url: params.url as string,
	};

	const getInjectableJSMessage = (message: any) => {
		return `
      window.dispatchEvent(new MessageEvent('message', {
        data: ${JSON.stringify(message)}
      }));
    `;
	};

	const handleAccept = () => {
		setIsRequireAccept(true);
		const js = getInjectableJSMessage(user);
		webViewRef.current?.injectJavaScript(js);
		console.log("✅ Đã gửi user:", user);
	};

	const handleAcceptPermission = () => {
		const js = getInjectableJSMessage({
			type: "ACCEPT_PERMISSIONS",
			data: {
				permission: isThirdpartyRequire || "unknown",
			},
		});
		setIsThirdpartyRequire("");
		webViewRef.current?.injectJavaScript(js);
		console.log("✅ Đã gửi user:", user);
	};

	const handleDenyPermission = () => {
		const js = getInjectableJSMessage({
			type: "DENY_PERMISSIONS",
			data: {
				permission: isThirdpartyRequire || "unknown",
			},
		});
		setIsThirdpartyRequire("");
		webViewRef.current?.injectJavaScript(js);
		console.log("✅ Đã gửi user:", user);
	}
	
	const handleMessage = (event: any) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);
			console.log("📩 Nhận từ WebView:", message);

			if (message.type === "READY") {
				setIsRequireAccept(false);
			}
			if (message.type === "ALERT") {
				Alert.alert("Thông báo", message.data);
			}

			if (message.type === "REQUIRE_PERMISSIONS") {
				// Handle permission request
				console.log("🔒 Yêu cầu quyền:", message.data);
				setIsThirdpartyRequire(message.data);
			}
		} catch (error) {
			console.warn("Lỗi parse message:", error);
		}
	};

	const renderLoadingScreen = () => {
		const percent = Math.round(loadingProgress * 100);

		return (
			<View style={styles.loadingContainer}>
				<Image source={{ uri: app?.icon || "https://placehold.co/120x120" }} style={styles.logo} />
				<Text style={styles.appName}>{app?.app_name || "{{APP_TITLE}}"}</Text>
				<Text style={styles.description}>{app?.description || "Ứng dụng của bạn đang tải... Hãy chờ chút nhé!"}</Text>

				<View style={styles.progressBar}>
					<View
						style={[styles.progressFill, { width: `${percent}%` }]}
					/>
				</View>
				<Text style={styles.progressText}>{percent}%</Text>
			</View>
		);
	};

	useEffect(() => {
	}, [ user ]);

	return (
		<View style={styles.container}>
			{!isLoaded && renderLoadingScreen()}

			{isAuthenticated && (
				<WebView
					ref={webViewRef}
					source={{ uri: app?.url || "https://dtbao.io.vn/" }}
					javaScriptEnabled
					onLoadProgress={({ nativeEvent }) => {
						setLoadingProgress(nativeEvent.progress);
					}}
					onLoadEnd={() => {
						setIsLoaded(true);
						// webViewRef.current?.injectJavaScript(getInjectableJSMessage(user));
						console.log(
							"📩 Gửi thông tin người dùng đến WebView:",
							user
						);
					}}
					onMessage={handleMessage}
					originWhitelist={["*"]}
					startInLoadingState={true}
					style={{ opacity: isLoaded ? 1 : 0 }}
				/>
			)}
			{
				// Create a model to accept permisions: Name, phonenumber
				!isRequireAccept && (
					<View style={styles.overlay}>
						<View style={styles.confirmBox}>
							<Text style={styles.appName}>Yêu cầu xác nhận</Text>
							<Text style={styles.description}>
								Ứng dụng này yêu cầu truy cập vào tên và số điện
								thoại của bạn để tiếp tục.
							</Text>

							{/* Cancel and accept */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<TouchableOpacity
									onPress={() => {
										router.back();
									}}
									style={styles.denyButton}
								>
									<Text style={styles.acceptButtonText}>
										Hủy
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleAccept}
									style={styles.acceptButton}
								>
									<Text style={styles.acceptButtonText}>
										Đồng ý và tiếp tục
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)
			}
			{
				// Create a model to accept permisions: Name, phonenumber
				isThirdpartyRequire && (
					<View style={styles.overlay}>
						<View style={styles.confirmBox}>
							<Text style={styles.appName}>Yêu cầu xác nhận</Text>
							<Text style={styles.description}>
								{`Ứng dụng này yêu cầu quyền truy cập vào ${
									isThirdpartyRequire
										? translatePermission[
												isThirdpartyRequire
										  ]
										: "<<không rõ>>"
								} của bạn để tiếp tục.`}
							</Text>

							{/* Cancel and accept */}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<TouchableOpacity
									onPress={handleDenyPermission}
									style={styles.denyButton}
								>
									<Text style={styles.acceptButtonText}>
										Hủy
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={handleAcceptPermission}
									style={styles.acceptButton}
								>
									<Text style={styles.acceptButtonText}>
										Đồng ý và tiếp tục
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)
			}
		</View>
	);
};

export default MiniAppWrapper;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		zIndex: 10,
	},
	logo: {
		width: 80,
		height: 80,
		marginBottom: 16,
		borderRadius: 12,
	},
	appName: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#1e3a8a",
	},
	description: {
		fontSize: 14,
		color: "#4b5563",
		marginTop: 4,
		textAlign: "center",
		paddingHorizontal: 20,
	},
	progressBar: {
		width: 200,
		height: 8,
		backgroundColor: "#e5e7eb",
		borderRadius: 4,
		marginTop: 20,
		overflow: "hidden",
	},
	progressFill: {
		height: "100%",
		backgroundColor: "#2563eb",
	},
	progressText: {
		marginTop: 10,
		color: "#374151",
		fontSize: 12,
	},
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 20,
	},
	confirmBox: {
		backgroundColor: "#fff",
		padding: 24,
		borderRadius: 16,
		width: "80%",
		alignItems: "center",
	},
	acceptButton: {
		marginTop: 20,
		backgroundColor: "#2563eb",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	denyButton: {
		marginTop: 20,
		backgroundColor: "#f87171",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	acceptButtonText: {
		color: "white",
		fontWeight: "bold",
	},
});

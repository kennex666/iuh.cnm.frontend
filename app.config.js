const dotenv = require("dotenv");
dotenv.config();

module.exports = {
	expo: {
		name: "iuh-cnm-frontend",
		slug: "iuh-cnm-frontend",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./resources/assets/images/icon.png",
		scheme: "myapp",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		ios: {
			infoPlist: {
				NSPhotoLibraryUsageDescription:
					"Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh nhóm.",
			},
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./resources/assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			package: "com.obxstd.studentchat",
			usesCleartextTraffic: true,
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./resources/assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					image: "./resources/assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#ffffff",
				},
			],
			[
				"expo-barcode-scanner",
				{
					cameraPermission: "Allow $(PRODUCT_NAME) to access camera.",
				},
			],
			[
				"expo-camera",
				{
					cameraPermission:
						"Allow $(PRODUCT_NAME) to access your camera",
					microphonePermission:
						"Allow $(PRODUCT_NAME) to access your microphone",
					recordAudioAndroid: true,
				},
			],
			[
				"expo-image-picker",
				{
					photosPermission:
						"The app accesses your photos to let you share them with your friends.",
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			HOST_BE: process.env.HOST_BE,
			PORT_BE: process.env.PORT_BE,
			eas: {
				projectId: "187df8f2-e681-46c9-ab22-6424723a3f19",
			},
		},
	},
};

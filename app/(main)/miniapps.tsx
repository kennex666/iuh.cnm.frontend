import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function MiniAppsScreen() {
  const [apps, setApps] = useState([]);

  // This state can be used to manage the list of mini apps if needed
  useEffect(() => {
    const fetchApps = async () => {
      fetch("https://pj.dtbao.io.vn/iuh.cnm.miniapps/list.json").then(response => response.json()).
      then(data => {
        setApps(data);
      }).catch(error => { 
        console.error("Error fetching mini apps:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách mini apps. Vui lòng thử lại sau.");
      });
    }

    fetchApps();
  }, []);

  return (
		<View className="flex-1 bg-white px-6 pt-14">
			{/* Header */}
			<Text className="text-3xl font-extrabold text-gray-900 mb-8">
				Mini Apps
			</Text>
			{/* Card Container */}
			<View className="space-y-6">
				{/* Học sinh Card */}
				<TouchableOpacity
					className="flex-row items-center bg-white rounded-2xl shadow-md px-6 py-5 mb-4"
					style={{
						elevation: 4,
						shadowColor: "#000",
						shadowOpacity: 0.08,
						shadowRadius: 12,
						shadowOffset: { width: 0, height: 4 },
					}}
					activeOpacity={0.9}
					onPress={() => router.push("/students")}
				>
					<View className="bg-blue-100 rounded-xl p-3 mr-4">
						<MaterialCommunityIcons
							name="account-child-outline"
							size={32}
							color="#2563eb"
						/>
					</View>
					<View>
						<Text className="text-lg font-bold text-gray-900">
							Học sinh
						</Text>
						<Text className="text-gray-400 text-sm mt-1">
							Mini app dành cho sinh viên
						</Text>
					</View>
				</TouchableOpacity>
				{/* Template Card */}
				{apps.map((app: any, index) => (
					<TouchableOpacity
						className="flex-row items-center bg-white rounded-2xl shadow-md px-6 py-5 mb-4"
						style={{
							elevation: 4,
							shadowColor: "#000",
							shadowOpacity: 0.08,
							shadowRadius: 12,
							shadowOffset: { width: 0, height: 4 },
						}}
						activeOpacity={0.9}
						onPress={() => {
							router.push({
								pathname: "/miniapp",
								params: app,
							});
						}}
					>
						<View className="bg-gray-200 rounded-xl p-3 mr-4">
              <Image
                source={{ uri: app?.icon || "https://via.placeholder.com/32" }}
                className="w-8 h-8 rounded-full"
                resizeMode="cover"/>
						</View>
						<View>
							<Text className="text-lg font-bold text-gray-900">
								{app?.app_name || "Mini App " + (index + 1)}
							</Text>
							<Text className="text-gray-400 text-sm mt-1">
								{app?.description || "Mô tả mini app"}
							</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</View>
  );
}

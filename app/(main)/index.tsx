import { View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function MessagesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1">
        <View className="h-14 px-4 border-b border-gray-100 justify-center">
          <Text className="text-xl font-semibold">Tin nhắn</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Chưa có tin nhắn nào</Text>
        </View>
      </View>
    </SafeAreaView>
  );
} 
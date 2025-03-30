import { View, Text } from 'react-native';

export default function MessagesScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="h-12 justify-center">
        <Text className="text-xl font-bold">Tin nhắn</Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Chưa có tin nhắn nào</Text>
      </View>
    </View>
  );
} 
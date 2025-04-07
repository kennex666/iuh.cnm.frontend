import React, { useState, useRef } from 'react';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Text, View, Image, TextInput, ScrollView, TouchableOpacity, Modal, Animated, Easing, ActivityIndicator } from 'react-native';
import { useMessages } from '../hooks/useMessages';
import { Conversation } from '../hooks/useConversations';

interface ChatAreaProps {
  selectedChat: Conversation | null;
}

export default function ChatArea({ selectedChat }: ChatAreaProps) {
  const [message, setMessage] = useState('');
  const [isModelChecked, setIsModelChecked] = useState(false);
  const [isModelImage, setIsModelImage] = useState(false);
  const [isModelEmoji, setIsModelEmoji] = useState(false);
  const [isModelSticker, setIsModelSticker] = useState(false);
  const [isModelGift, setIsModelGift] = useState(false);
  const scaleAnimation = useRef(new Animated.Value(0)).current;

  const { messages, loading, error } = useMessages(selectedChat?.id || undefined);

  // Toggle models 
  const toggleModelChecked = () => {
    if (isModelChecked) {
      Animated.timing(scaleAnimation, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setIsModelChecked(false));
    } else {
      setIsModelChecked(true);
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleModelImage = () => {
    setIsModelImage(!isModelImage);
  };

  const toggleModelEmoji = () => {
    setIsModelEmoji(!isModelEmoji);
  };

  const toggleModelSticker = () => {
    setIsModelSticker(!isModelSticker);
  };

  const toggleModelGift = () => {
    setIsModelGift(!isModelGift);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0068FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error}</Text>
      </View>
    );
  }

  if (!selectedChat) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 flex-col">
      {/* Chat Header */}
      <View className="h-16 px-4 border-b border-gray-200 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={{ uri: selectedChat?.avatarUrl || 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G' }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3">
            <Text className="font-semibold text-gray-900">
              {selectedChat?.name || selectedChat?.participantIds.join(', ')}
            </Text>
            {selectedChat?.isGroup && (
              <Text className="text-sm text-gray-500">{selectedChat.participantIds.length} thành viên</Text>
            )}
            {!selectedChat?.isGroup && selectedChat?.participantIds.length > 0 && (
              <Text className="text-sm text-green-500">Đang hoạt động</Text>
            )}
          </View>
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity>
            <Ionicons name="call-outline" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="videocam-outline" size={22} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Area */}
      <ScrollView className="flex-1 p-4">
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row items-end mb-4 ${msg.senderId === 'u1' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderId !== 'u1' && (
              <Image
                source={{ uri: 'https://placehold.co/40x40/0068FF/FFFFFF/png?text=G' }}
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <View>
              <View
                className={`rounded-2xl px-4 py-2 max-w-[70%] ${msg.senderId === 'u1' ? 'bg-blue-500' : 'bg-gray-100'}`}
              >
                <Text className={msg.senderId === 'u1' ? 'text-white' : 'text-gray-900'}>
                  {msg.content}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="border-t border-gray-200 p-4">
        <View className="flex-row items-center position-relative">
          <TouchableOpacity className="p-2" onPress={toggleModelChecked}>
            <Ionicons name="add-circle-outline" size={24} color="#666" />
          </TouchableOpacity>
          {isModelChecked && (
            <View className='absolute bottom-full left-0 bg-white z-50'>
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: scaleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0],
                      }),
                    },
                    {
                      translateY: scaleAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  opacity: scaleAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                }}
              >
                <View className="bg-white shadow-md rounded-lg p-4 w-[300px]">
                  <Text className="text-gray-800 mb-2">Chọn loại tệp</Text>
                  <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelImage}>
                    <Ionicons name="image-outline" size={24} color="#666" />
                    <Text className="ml-2 text-gray-800">Hình ảnh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelEmoji}>
                    <Ionicons name="happy-outline" size={24} color="#666" />
                    <Text className="ml-2 text-gray-800">Biểu tượng cảm xúc</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelSticker}>
                    <Ionicons name="happy-outline" size={24} color="#666" />
                    <Text className="ml-2 text-gray-800">Sticker</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center mb-2" onPress={toggleModelGift}>
                    <Ionicons name="gift-outline" size={24} color="#666" />
                    <Text className="ml-2 text-gray-800">Quà tặng</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          )}
          <View className="flex-1 bg-gray-100 rounded-full mx-2 px-4 py-2">
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={1}
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity className="p-2">
            <Ionicons name="happy-outline" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="send" size={24} color="#0068FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
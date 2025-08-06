import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import { useUser } from '@/src/contexts/user/UserContext';
import SocketService from '@/src/api/services/SocketService';
import { AuthStorage } from '@/src/storage/AuthStorage';

const SCHOOLS = [
  {
    label: 'Trường Đại học Công nghiệp TP.HCM',
    value: 'iuh',
    vrtour: 'https://vr.iuh.edu.vn/',
    website: 'https://sv.iuh.edu.vn/tra-cuu-thong-tin.html',
  },
  {
    label: 'Trường Đại học Gia Định',
    value: 'gia-dinh',
    vrtour: 'https://vr.uit.edu.vn/',
    website: 'https://sinhvien.giadinh.edu.vn/tra-cuu-thong-tin.html',
  },
  {
    label: 'Trường Đại học Sư phạm Kỹ thuật TP.HCM',
    value: 'hcmute',
    vrtour: 'https://vr360.com.vn/projects/dhspkt-hcm/',
    website: 'https://online.hcmute.edu.vn/',
  },
  {
    label: 'Trường Đại học Ngân hàng TP.HCM',
    value: 'hcmut',
    vrtour: 'https://vr360.com.vn/projects/dai-hoc-ngan-hang-tp-hcm/',
    website: 'https://hub.edu.vn/dang-nhap',
  },
  
];

export default function StudentOnboardingScreen() {
  const [selectedSchool, setSelectedSchool] = useState(SCHOOLS[0].value);
  const [showSchoolList, setShowSchoolList] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{text: string, isUser: boolean}>>([]);
  const {user} = useUser();
  const socketService = SocketService.getInstance();

  const handleWebView = (url: string) => {
    setWebViewUrl(url);
  };

  // Define the handler outside useEffect so it's accessible in cleanup


  useEffect(() => {
    const onChatWithAIResponse = (data: { message: string }) => {
      setChatHistory(prev => [...prev, { text: data.message, isUser: false }]);
    };
    if (user) {
      socketService.onChatWithAIResponse(onChatWithAIResponse);
    }

    return () => {
      socketService.removeChatWithAIResponseListener(onChatWithAIResponse);
    };
  }, [user, socketService]);

  const handleSendMessage = async () => {
    const token = await AuthStorage.getAccessToken();
    if (message.trim()) {
      socketService.sendChatWithAI({
        message: message.trim(),
        token: token ?? '',
      });
      setChatHistory([...chatHistory, { text: message, isUser: true }]);  
      setMessage('');
    }
  };

  if (webViewUrl) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <TouchableOpacity
          style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}
          onPress={() => setWebViewUrl(null)}
        >
          <MaterialIcons name="close" size={32} color="#3B82F6" />
        </TouchableOpacity>
        <WebView source={{ uri: webViewUrl }} className="flex-1" />
      </SafeAreaView>
    );
  }

  if (showChat) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center px-4 py-3 border-b border-gray-200 bg-blue-600">
            <TouchableOpacity onPress={() => setShowChat(false)}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="ml-4 text-lg font-semibold text-white">Chat với AI về trường học</Text>
          </View>

          {/* Welcome Message */}
          {chatHistory.length === 0 && (
            <View className="flex-1 items-center justify-center px-4">
              <MaterialCommunityIcons name="robot" size={64} color="#3B82F6" />
              <Text className="text-xl font-bold text-gray-800 mt-4">Xin chào!</Text>
              <Text className="text-center text-gray-600 mt-2">
                Tôi là trợ lý AI. Tôi có thể giúp bạn tìm hiểu thông tin về trường học và giải đáp các thắc mắc của bạn.
              </Text>
            </View>
          )}

          {/* Chat Messages */}
          <ScrollView 
            className="flex-1 px-4 py-2"
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {chatHistory.map((msg, index) => (
              <View
                key={index}
                className={`mb-3 max-w-[80%] ${
                  msg.isUser ? 'self-end' : 'self-start'
                }`}
              >
                <View
                  className={`rounded-2xl px-4 py-2 ${
                    msg.isUser ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <Text
                    className={`text-base ${
                      msg.isUser ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Area - Fixed at bottom */}
          <View className="border-t border-gray-200 bg-white px-4 py-3">
            <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
              <TextInput
                className="flex-1 text-base"
                placeholder="Nhập tin nhắn của bạn..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                className="bg-blue-600 rounded-full p-2 ml-2"
                disabled={!message.trim()}
                style={{ opacity: message.trim() ? 1 : 0.5 }}
              >
                <MaterialIcons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-20"></View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white justify-between">
      <View className="px-6 pt-16">
        {/* Logo và tiêu đề */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-blue-700">Student</Text>
        </View>
        {/* Hướng dẫn */}
        <Text className="text-center text-gray-500 mb-6">
          Vui lòng chọn trường bạn muốn tra cứu
        </Text>
        {/* Dropdown chọn trường */}
        <TouchableOpacity
          className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4"
          activeOpacity={0.8}
          onPress={() => setShowSchoolList(!showSchoolList)}
        >
          <MaterialCommunityIcons name="school-outline" size={22} color="#3B82F6" />
          <Text className="flex-1 text-base text-gray-700 font-semibold ml-3">
            {SCHOOLS.find(s => s.value === selectedSchool)?.label}
          </Text>
          <MaterialIcons name="more-vert" size={22} color="#64748B" />
        </TouchableOpacity>
        {/* Danh sách trường */}
        {showSchoolList && (
          <View className="bg-white border border-gray-200 rounded-xl mb-4">
            {SCHOOLS.map(school => (
              <TouchableOpacity
                key={school.value}
                className="px-4 py-3 flex-row items-center"
                onPress={() => {
                  setSelectedSchool(school.value);
                  setShowSchoolList(false);
                }}
              >
                <MaterialCommunityIcons name="school-outline" size={20} color="#3B82F6" />
                <Text className="ml-3 text-gray-700 text-base">{school.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* Nút tra cứu */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-xl overflow-hidden mt-2 mb-2"
          onPress={() => {
            handleWebView(SCHOOLS.find(s => s.value === selectedSchool)?.website || '');
          }}
        >
          <View className="py-3 items-center bg-blue-600">
            <Text className="text-white text-lg font-bold">Tra cứu</Text>
          </View>
        </TouchableOpacity>
        {/* Tham quan*/}
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-xl overflow-hidden mt-2 mb-2"
          onPress={() => {
            handleWebView(SCHOOLS.find(s => s.value === selectedSchool)?.vrtour || '');
          }}
        >
          <View className="py-3 items-center bg-blue-600">
            <Text className="text-white text-lg font-bold">Tham quan</Text>
          </View>
        </TouchableOpacity>
        {/* Chatbot AI */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-xl overflow-hidden mt-2 mb-2"
          onPress={() => setShowChat(true)}
        >
          <View className="py-3 items-center bg-blue-600">
            <Text className="text-white text-lg font-bold">Giải đáp thắc mắc</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

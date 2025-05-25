import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

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

  const handleWebView = (url: string) => {
    setWebViewUrl(url);
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
      </View>
    </SafeAreaView>
  );
}

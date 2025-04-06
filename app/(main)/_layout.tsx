import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions } from 'react-native';

export default function AppLayout() {
  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3390EC',
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarPosition: isDesktop ? 'left' : 'bottom',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tin nhắn',
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Danh bạ',
          tabBarIcon: ({ color }) => <FontAwesome name="address-book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Nhật ký',
          tabBarIcon: ({ color }) => <FontAwesome name="clock-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 
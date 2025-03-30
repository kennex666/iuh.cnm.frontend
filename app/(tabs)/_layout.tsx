import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#3390EC',
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
        name="discover"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <FontAwesome name="compass" size={24} color={color} />,
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
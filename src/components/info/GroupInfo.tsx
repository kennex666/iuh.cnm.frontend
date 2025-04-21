import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Conversation } from "@/src/models/Conversation";
import { Dimensions } from "react-native";
import AddMemberModal from "./AddMemberModal";// Update the path to the correct location of AddMemberModal

interface GroupInfoProps {
  group: Conversation;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  isOnline: boolean;
}

// Mock data cho người dùng có thể thêm vào nhóm
const MOCK_USERS = [
  {
    id: '8',
    name: 'Nguyễn Văn A',
    avatar: 'https://placehold.co/96x96/png',
    isOnline: true,
    mutualFriends: 5
  },
  {
    id: '9',
    name: 'Trần Thị B',
    avatar: 'https://placehold.co/96x96/png',
    isOnline: false,
    mutualFriends: 3
  },
  {
    id: '10',
    name: 'Lê Văn C',
    avatar: 'https://placehold.co/96x96/png',
    isOnline: true,
    mutualFriends: 8
  },
  {
    id: '11',
    name: 'Phạm Thị D',
    avatar: 'https://placehold.co/96x96/png',
    isOnline: false,
    mutualFriends: 2
  }
];

// Mock data cho thành viên nhóm
const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Hoang Khanh",
    avatar: "https://placehold.co/96x96/png",
    role: "admin",
    isOnline: true,
  },
  {
    id: "2",
    name: "Trần Văn Lợi",
    avatar: "https://placehold.co/96x96/png",
    role: "admin",
    isOnline: false,
  },
  {
    id: "3",
    name: "An Quốc Việt",
    avatar: "https://placehold.co/96x96/png",
    role: "member",
    isOnline: true,
  },
  {
    id: "4",
    name: "Anh Hải",
    avatar: "https://placehold.co/96x96/png",
    role: "member",
    isOnline: false,
  },
  {
    id: "5",
    name: "Anh Khoa",
    avatar: "https://placehold.co/96x96/png",
    role: "member",
    isOnline: true,
  },
  {
    id: "6",
    name: "Đăng Quang",
    avatar: "https://placehold.co/96x96/png",
    role: "member",
    isOnline: false,
  },
  {
    id: "7",
    name: "Dương Nguyễn",
    avatar: "https://placehold.co/96x96/png",
    role: "member",
    isOnline: true,
  },
];

interface MemberMenuProps {
  visible: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const isDesktop = Dimensions.get('window').width > 768;

const MemberMenu = ({ visible, onClose, isAdmin = false }: MemberMenuProps) => {
  if (!visible) return null;

  return (
    <View
      style={{
        width: 240,
        zIndex: 1000,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB', 
        marginTop: 2
      }}>
      {!isAdmin && (
        <View className="flex-1">
          <TouchableOpacity
            className="flex-row items-center px-4 py-3 active:bg-gray-50"
            onPress={() => {
              // Handle add admin
              onClose();
            }}
          >
            <Ionicons name="shield-outline" size={18} color="#3B82F6" />
            <Text className="ml-2 text-[14px] text-gray-700">
              Thêm làm trưởng nhóm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center px-4 py-3 active:bg-gray-50"
            onPress={() => {
              // Handle add sub-admin
              onClose();
            }}
          >
            <Ionicons name="shield-half-outline" size={18} color="#3B82F6" />
            <Text className="ml-2 text-[14px] text-gray-700">
              Thêm làm phó nhóm
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isAdmin ? (
        <TouchableOpacity
          className="flex-row items-center px-4 py-3 active:bg-gray-50"
          onPress={() => {
            // Handle remove admin
            onClose();
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text className="ml-2 text-[14px] text-red-500">
            Xóa tư cách quản trị viên
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="flex-row items-center px-4 py-3 active:bg-gray-50"
          onPress={() => {
            // Handle remove member
            onClose();
          }}
        >
          <Ionicons name="exit-outline" size={18} color="#EF4444" />
          <Text className="ml-2 text-[14px] text-red-500">
            Xóa khỏi nhóm
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function GroupInfo({ group }: GroupInfoProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const ShowDetail = () => {
    const [openMenuForMember, setOpenMenuForMember] = useState<string | null>(null);

    return (
      <View className="flex-1">
        {/* Admins Section */}
        <Text className="text-sm text-gray-500 mb-2">Quản trị viên</Text>
        {MOCK_MEMBERS.filter(member => member.role === 'admin').map((member) => (
          <View key={member.id} className="flex-row items-start justify-between py-2">
            <View className="flex-row items-center">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: member.avatar }}
                  className="w-10 h-10 rounded-full"
                />
                {member.isOnline && (
                  <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </View>
              <View className="ml-3">
                <Text className="text-[15px] font-medium text-gray-900">{member.name}</Text>
                <Text className="text-sm text-blue-500">Quản trị viên</Text>
              </View>
            </View>
            <View className="relative flex-1 items-end">
              <TouchableOpacity
                className="p-2"
                onPress={() => setOpenMenuForMember(openMenuForMember === member.id ? null : member.id)}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
              <MemberMenu
                visible={openMenuForMember === member.id}
                onClose={() => setOpenMenuForMember(null)}
                isAdmin={true}
              />
            </View>
          </View>
        ))}

        {/* Members Section */}
        <Text className="text-sm text-gray-500 mt-4 mb-2">Thành viên</Text>
        {MOCK_MEMBERS.filter(member => member.role === 'member').map((member) => (
          <View key={member.id} className="flex-row py-2">
            <View className="flex-row">
              <Image
                source={{ uri: member.avatar }}
                className="w-10 h-10 rounded-full"
              />
            </View>
            <View className="ml-3">
              <Text className="text-[15px] font-medium text-gray-900">{member.name}</Text>
              <Text className="text-sm text-gray-500">
                {member.isOnline ? 'Đang hoạt động ' : 'Không hoạt động'}
                {member.isOnline && (
                  <View className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </Text>
            </View>
            <View className="relative flex-1 items-end">
              <TouchableOpacity
                className="p-2"
                onPress={() => setOpenMenuForMember(openMenuForMember === member.id ? null : member.id)}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
              </TouchableOpacity>
              <MemberMenu
                visible={openMenuForMember === member.id}
                onClose={() => setOpenMenuForMember(null)}
                isAdmin={false}
              />
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 px-4 pt-6 pb-4 border-b-4 border-gray-200">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-medium text-blue-950">
          Thành viên nhóm ({MOCK_MEMBERS.length})
        </Text>
        <TouchableOpacity
          className="py-1 px-3"
          onPress={() => setShowDetail(!showDetail)}
        >
          <Ionicons name={showDetail ? "chevron-up" : "chevron-down"} size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      {showDetail && <ShowDetail />}
    </View>
  );
}

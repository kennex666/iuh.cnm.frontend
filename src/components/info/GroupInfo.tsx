import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Conversation } from "@/src/models/Conversation";
import { Dimensions } from "react-native";

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

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
}

interface MemberMenuProps {
  visible: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const isDesktop = Dimensions.get('window').width > 768;

const AddMemberModal = ({ visible, onClose }: AddMemberModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View className="flex-1 bg-black/30 items-center">
        {/* Container cho desktop */}
        <View style={[
          {
            width: isDesktop ? 400 : '100%',
            height: isDesktop ? 480 : '100%',
            borderRadius: isDesktop ? 16 : 0,
            overflow: 'hidden',
            marginTop: isDesktop ? 100 : 0
          }
        ]}>
          {/* Content container */}
          <View style={[
            {
              flex: 1,
              backgroundColor: 'white',
              marginTop: isDesktop ? 0 : 64,
              borderTopLeftRadius: isDesktop ? 0 : 24,
              borderTopRightRadius: isDesktop ? 0 : 24
            }
          ]}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
              <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text className="text-lg font-semibold">Thêm thành viên</Text>
              <TouchableOpacity
                className={`py-1 px-3 rounded-lg ${selectedUsers.length > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}
                disabled={selectedUsers.length === 0}
              >
                <Text className={selectedUsers.length > 0 ? 'text-white' : 'text-gray-500'}>
                  Thêm ({selectedUsers.length})
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-2 border-b border-gray-200">
              <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                  className="flex-1 ml-2 text-base"
                  placeholder="Tìm kiếm bạn bè"
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* User List */}
            <ScrollView className="flex-1 px-4">
              {filteredUsers.map(user => (
                <TouchableOpacity
                  key={user.id}
                  className="flex-row items-center py-3 hover:bg-gray-50 active:bg-gray-100"
                  onPress={() => toggleUserSelection(user.id)}
                >
                  <View className="relative">
                    <Image
                      source={{ uri: user.avatar }}
                      className="w-12 h-12 rounded-full"
                    />
                    {user.isOnline && (
                      <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-[15px] font-medium text-gray-900">{user.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {user.mutualFriends} bạn chung
                    </Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center
                    ${selectedUsers.includes(user.id)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'}`}
                  >
                    {selectedUsers.includes(user.id) && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              {/* Padding bottom for better scrolling */}
              <View className="h-4" />
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const MemberMenu = ({ visible, onClose, isAdmin = false }: MemberMenuProps) => {
  if (!visible) return null;

  return (
    <View
      style={{
        width: 200,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: 'white',
        zIndex: 1000,

      }}>
      {!isAdmin && (
        <View className="flex-1 bg-white">
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
          <View key={member.id} className="flex-row items-center justify-between py-2">
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

        {/* Add Member Button */}
        <TouchableOpacity
          className="flex-row items-center py-2 mt-2"
          onPress={() => setShowAddMember(true)}
        >
          <View className="p-2 rounded-full bg-blue-50 items-center justify-center">
            <Ionicons name="person-add-outline" size={16} color="#3B82F6" />
          </View>
          <Text className="ml-3 text-[15px] font-medium text-blue-500">
            Thêm thành viên
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 px-4 pt-6 pb-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-medium text-blue-950">
          Thành viên nhóm ({MOCK_MEMBERS.length})
        </Text>
        <TouchableOpacity
          className="py-1 px-3 rounded-lg bg-blue-50 active:bg-blue-100"
          onPress={() => setShowDetail(!showDetail)}
        >
          <Text className="text-blue-500">Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      {showDetail && <ShowDetail />}

      <AddMemberModal
        visible={showAddMember}
        onClose={() => setShowAddMember(false)}
      />
    </View>
  );
}

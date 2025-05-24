import React, {useEffect, useState} from "react";
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Conversation} from "@/src/models/Conversation";
import {useUser} from "@/src/contexts/user/UserContext";
import {ConversationService} from "@/src/api/services/ConversationService";

interface GroupInfoProps {
    conversation: Conversation;
}

interface Member {
    id: string;
    name: string;
    avatar: string;
    role: 'admin' | 'member';
    members: string;
}

interface MemberMenuProps {
    visible: boolean;
    onClose: () => void;
    isAdmin?: boolean;
    isModerator?: boolean;
    memberId: string;
    onRemoveMember?: (memberId: string) => void;
    onAddAdmin?: (memberId: string) => void;
    onAddMod?: (memberId: string) => void;
    onRemoveAdmin?: (memberId: string) => void;
}

const isDesktop = Dimensions.get('window').width > 768;


export default function GroupInfo({conversation}: GroupInfoProps) {
    const [showDetail, setShowDetail] = useState(false);
    const [members, setMembers] = useState<Conversation['participantInfo']>(conversation.participantInfo || []);
    const {user} = useUser();
    useEffect(() => {
        const fetchParticipantInfo = () => {
            const info = conversation.participantInfo || [];
            setMembers(info);
            };

            fetchParticipantInfo();
    }, [conversation]);

    const handleRemoveMember = async (memberId: string) => {
        try {
            const response = await ConversationService.removeParticipants(conversation.id, [memberId]);
            if (response.success) {
                console.log('Member removed successfully');
                setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
            } else {
                console.error('Failed to remove member:', response.message);
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };

    const handleAddAdmin = async (memberId: string) => {
        try {
            const response = await ConversationService.transferAdmin(conversation.id, memberId);
            if (response.success) {
                console.log('Admin role transferred successfully');
            } else {
                console.error('Failed to transfer admin role:', response.message);
            }
        } catch (error) {
            console.error('Error transferring admin role:', error);
        }
    };

    const handleAddMod = async (memberId: string) => {
        try {
            const response = await ConversationService.grantModRole(conversation.id, memberId);
            if (response.success) {
                console.log('Mod role granted successfully');
            } else {
                console.error('Failed to grant mod role:', response.message);
            }
        } catch (error) {
            console.error('Error granting mod role:', error);
        }
    };

    const handleRemoveAdmin = async (memberId: string) => {
        try {
            const response = await ConversationService.removeParticipants(conversation.id, [memberId]);
            if (response.success) {
                console.log('Admin role removed successfully');
            } else {
                console.error('Failed to remove admin role:', response.message);
            }
        } catch (error) {
            console.error('Error removing admin role:', error);
        }
    };

    const MemberMenu = ({
                            visible,
                            onClose,
                            isAdmin = false,
                            isModerator = false,
                            memberId,
                            onRemoveMember,
                            onAddAdmin,
                            onAddMod,
                            onRemoveAdmin
                        }: MemberMenuProps) => {
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
                {!isAdmin && !isModerator && (
                    <View className="flex-1">
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3 active:bg-gray-50"
                            onPress={() => {
                                onAddAdmin?.(memberId);
                                onClose();
                            }}
                        >
                            <Ionicons name="shield-outline" size={18} color="#3B82F6"/>
                            <Text className="ml-2 text-[14px] text-gray-700">
                                Chuyển quyền quản trị viên
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-row items-center px-4 py-3 active:bg-gray-50"
                            onPress={() => {
                                onAddMod?.(memberId);
                                onClose();
                            }}
                        >
                            <Ionicons name="shield-half-outline" size={18} color="#3B82F6"/>
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
                            onRemoveAdmin?.(memberId);
                            onClose();
                        }}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444"/>
                        <Text className="ml-2 text-[14px] text-red-500">
                            Xóa tư cách quản trị viên
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        className="flex-row items-center px-4 py-3 active:bg-gray-50"
                        onPress={() => {
                            onRemoveMember?.(memberId);
                            onClose();
                        }}
                    >
                        <Ionicons name="exit-outline" size={18} color="#EF4444"/>
                        <Text className="ml-2 text-[14px] text-red-500">
                            Xóa khỏi nhóm
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const ShowDetail = () => {
        const [openMenuForMember, setOpenMenuForMember] = useState<string | null>(null);
        return (
            <View className="flex-1">
                {/* Admins Section */}
                <Text className="text-sm text-gray-500 mb-2">Quản trị viên</Text>
                {members.filter(member => member.role === 'admin' || member.role === 'mod').map((member, index) => (
                    <View key={member.id} className="flex-row items-start justify-between py-2">
                        <View className="flex-row items-center">
                            <View className="flex-row items-center">
                                <Image
                                    source={{uri: (member.avatar?.trim() || '') == 'default' ? `https://picsum.photos/id/${index}/200/300` : member.avatar}}
                                    className="w-10 h-10 rounded-full"
                                />
                                <Text>
                                </Text>
                            </View>
                            <View className="ml-3">
                                <Text className="text-[15px] font-medium text-gray-900">{member.name}</Text>
                                {member.role === 'admin' && <View className="flex-row items-center">
                                    <Ionicons name="shield-checkmark" size={16} color="#3B82F6"/>
                                    <Text className="text-sm text-gray-500 ml-1">Quản trị viên</Text>
                                    {
                                        member.id === user?.id && (
                                            <Text className="text-sm text-gray-500 ml-1"> (Bạn)</Text>
                                        )
                                    }
                                </View>}
                                {member.role === 'mod' &&
                                    <View className="flex-row items-center">
                                        <Ionicons name="shield-half-outline" size={16} color="#3B82F6"/>
                                        <Text className="text-sm text-gray-500 ml-1">Phó nhóm</Text>
                                        {
                                            member.id === user?.id && (
                                                <Text className="text-sm text-gray-500 ml-1"> (Bạn)</Text>
                                            )
                                        }
                                </View>}
                            </View>
                        </View>
                        <View className="relative flex-1 items-end">
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => setOpenMenuForMember(openMenuForMember === member.id ? null : member.id)}
                            >
                                <Ionicons name="ellipsis-horizontal" size={20} color="#666"/>
                            </TouchableOpacity>
                            {
                                (member.id !== user?.id && (members.find(p => p.id === user?.id)?.role === 'admin')) && (
                                    <MemberMenu
                                        visible={openMenuForMember === member.id}
                                        onClose={() => setOpenMenuForMember(null)}
                                        isAdmin={true}
                                        isModerator={false}
                                        memberId={member.id}
                                        onRemoveAdmin={handleRemoveAdmin}
                                    />
                                )
                            }
                        </View>
                    </View>
                ))}

                {/* Members Section */}
                <Text className="text-sm text-gray-500 mt-4 mb-2">Thành viên</Text>
                {members.filter(member => (member.role === 'member' && member.id !== user?.id)).map((member, index) => (
                    <View key={member.id} className="flex-row py-2">
                        <View className="flex-row">
                            <Image
                                source={{uri: (member.avatar?.trim() || '') == 'default' ? `https://picsum.photos/id/${index}/200/300` : member.avatar}}
                                className="w-10 h-10 rounded-full"
                            />
                        </View>
                        <View className="ml-3">
                            <Text className="text-[15px] font-medium text-gray-900">{member.name}</Text>
                            <Text className="text-sm text-gray-500">
                                Thành viên
                                {
                                    member.id === user?.id && (
                                        <Text className="text-sm text-gray-500 ml-1"> (Bạn)</Text>
                                    )
                                }
                            </Text>
                        </View>
                        <View className="relative flex-1 items-end">
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => setOpenMenuForMember(openMenuForMember === member.id ? null : member.id)}
                            >
                                <Ionicons name="ellipsis-horizontal" size={20} color="#666"/>
                            </TouchableOpacity>
                            {
                                (members.find(p => p.id === user?.id)?.role === 'admin' ||
                                    (members.find(p => p.id === user?.id)?.role === 'mod' && member.role === 'member')) && (
                                    <MemberMenu
                                        visible={openMenuForMember === member.id}
                                        onClose={() => setOpenMenuForMember(null)}
                                        isAdmin={false}
                                        isModerator={members.find(p => p.id === user?.id)?.role === 'mod'}
                                        memberId={member.id}
                                        onRemoveMember={handleRemoveMember}
                                        onAddAdmin={handleAddAdmin}
                                        onAddMod={handleAddMod}
                                    />
                                )
                            }
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
                    Thành viên nhóm ({conversation.participantInfo.length - 1})
                </Text>
                <TouchableOpacity
                    className="py-1 px-3"
                    onPress={() => setShowDetail(!showDetail)}
                >
                    <Ionicons name={showDetail ? "chevron-up" : "chevron-down"} size={18} color="#3B82F6"/>
                </TouchableOpacity>
            </View>
            {showDetail && <ShowDetail/>}
        </View>
    );
}

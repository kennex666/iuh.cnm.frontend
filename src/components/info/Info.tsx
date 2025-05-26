import { ConversationService } from '@/src/api/services/ConversationService';
import { useUser } from '@/src/contexts/user/UserContext';
import { Conversation } from '@/src/models/Conversation';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ActionsInfo from './ActionsInfo';
import FilesInfo from './FilesInfo';
import GroupInfo from './GroupInfo';
import HeaderInfo from './HeaderInfo';
import MediaInfo from './MediaInfo';
import ProfileInfo from './ProfileInfo';
import Search from './Search';
const {Alert} = require('react-native');


// Props interface cho component Info
export interface InfoProps {
    selectedChat: Conversation | null;
    onBackPress?: () => void;
    onScrollToMessage?: (messageId: string) => void;
    onConversationUpdate?: (updatedConversation: Conversation) => void;
}

export default function Info({selectedChat, onBackPress, onScrollToMessage, onConversationUpdate}: InfoProps) {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(selectedChat);
    const {user} = useUser(); // Get the current user

    useEffect(() => {
        if (selectedChat) {
            setConversation(selectedChat);
        }
    }, [selectedChat?.id]);

    const handleSearchPress = () => {
        setIsSearchVisible(true);
    };

    const isAdmin = React.useMemo(() => {
        if (!conversation || !user) return false;

        const currentParticipant = conversation.participantInfo?.find((participant) => participant.id === user.id);

        return currentParticipant?.role === 'admin';
    }, [conversation, user]);

    const handleDisbandGroup = async () => {
        console.log('Disband group:', selectedChat?.id);
        try {
            if (!selectedChat?.id) {
                console.error('Conversation ID is undefined');
                return;
            }
            const response = await ConversationService.deleteConversation(selectedChat?.id);
            if (response.success) {
                console.log('Group disbanded successfully');
            } else {
                console.error('Error disbanding group:', response.message);
            }
        } catch (error) {
            console.error('Error disbanding group:', error);
        }
    };

    
    const handleLeftGroup = async () => {
		console.log("Left group:", selectedChat?.id);
		try {
			if (!selectedChat?.id) {
				console.error("Conversation ID is undefined");
				return;
			}
			const response = await ConversationService.leftConversation(
				selectedChat?.id
			);
			if (response.success) {
				console.log("Group left successfully");
			} else {
				console.error("Error left group:", response.message);
			}
		} catch (error) {
			console.error("Error left group:", error);
		}
	};

	const handleConversationUpdate = (updatedConversation: Conversation) => {
		setConversation(updatedConversation);
	};

    // Helper function để lấy icon cho từng loại file
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf':
                return 'document-text-outline';
            case 'docx':
                return 'document-outline';
            case 'xlsx':
                return 'grid-outline';
            case 'zip':
                return 'folder-outline';
            default:
                return 'document-outline';
        }
    };

    // Hiển thị placeholder khi chưa chọn cuộc trò chuyện
    if (!selectedChat) {
        return (
            <View className="flex-1 items-center justify-center bg-blue-50/50 rounded-2xl m-4">
                <View className="bg-white p-6 rounded-2xl shadow-sm items-center">
                    <Ionicons name="chatbubble-ellipses-outline" size={48} color="#3B82F6" />
                    <Text className="text-blue-900 mt-4 text-center">Chọn một cuộc trò chuyện để xem thông tin chi tiết</Text>
                </View>
            </View>
        );
    }

    return (
		<View className="flex-1 bg-white">
			<View className="z-10">
				<HeaderInfo
					selectedChat={selectedChat}
					isGroup={selectedChat.isGroup}
					onBackPress={onBackPress}
				/>
			</View>
			<ScrollView className="flex-1">
				<ProfileInfo 
					conversation={conversation} 
					onConversationUpdate={onConversationUpdate} 
				/>
				<ActionsInfo
					selectChat={selectedChat}
					setConversation={setConversation}
					onSearchPress={handleSearchPress}
				/>
				{selectedChat.isGroup &&
					conversation &&
					conversation.participantIds && (
						<GroupInfo conversation={conversation} />
					)}
				<MediaInfo
                    conversationId={selectedChat.id}
                    onViewAll={() => {
                        
                    }}
                    onPreviewMedia={(url, type) => {
                        if (type === 'image') {
                            
                        } else if (type === 'video') {
                            
                        }
                    }}
                />
                <FilesInfo conversationId={selectedChat.id} onViewAll={() => {}} />
				{selectedChat.isGroup && isAdmin && (
					<View className="mb-2 pt-2 border-t border-gray-200">
						<TouchableOpacity
							className="flex-row items-center px-4 py-2 rounded-xl"
							onPress={async () => {
								let confirmed = false;
								if (
									typeof window !== "undefined" &&
									window.confirm
								) {
									// Web: dùng window.confirm
									confirmed = window.confirm(
										"Bạn có chắc chắn muốn giải tán nhóm này không?"
									);
								} else {
									// Mobile: dùng Alert
									// @ts-ignore
									await new Promise<void>((resolve) => {
										Alert.alert(
											"Xác nhận",
											"Bạn có chắc chắn muốn giải tán nhóm này không?",
											[
												{
													text: "Không",
													style: "cancel",
													onPress: () => {
														confirmed = false;
														resolve();
													},
												},
												{
													text: "Có",
													style: "destructive",
													onPress: () => {
														confirmed = true;
														resolve();
													},
												},
											],
											{ cancelable: true }
										);
									});
								}
								if (confirmed) {
									await handleDisbandGroup();
								}
							}}
						>
							<Ionicons
								name="trash-outline"
								size={18}
								color="red"
								className="mr-2"
							/>
							<Text className="text-red-500 font-semibold text-sm">
								Giải tán nhóm
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{selectedChat.isGroup && !isAdmin && (
					<View className="mb-2 pt-2 border-t border-gray-200">
						<TouchableOpacity
							className="flex-row items-center px-4 py-2 rounded-xl"
							onPress={async () => {
								let confirmed = false;
								if (
									typeof window !== "undefined" &&
									window.confirm
								) {
									// Web: dùng window.confirm
									confirmed = window.confirm(
										"Bạn có chắc chắn muốn rời nhóm này không?"
									);
								} else {
									// Mobile: dùng Alert
									// @ts-ignore
									await new Promise<void>((resolve) => {
										Alert.alert(
											"Xác nhận",
											"Bạn có chắc chắn muốn rời nhóm này không?",
											[
												{
													text: "Không",
													style: "cancel",
													onPress: () => {
														confirmed = false;
														resolve();
													},
												},
												{
													text: "Có",
													style: "destructive",
													onPress: () => {
														confirmed = true;
														resolve();
													},
												},
											],
											{ cancelable: true }
										);
									});
								}
								if (confirmed) {
									await handleLeftGroup();
								}
							}}
						>
							<Ionicons
								name="trash-outline"
								size={18}
								color="red"
								className="mr-2"
							/>
							<Text className="text-red-500 font-semibold text-sm">
								Rời nhóm
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>

			<Search
				isVisible={isSearchVisible}
				onClose={() => setIsSearchVisible(false)}
				conversationId={selectedChat.id}
				onSelectMessage={onScrollToMessage}
			/>
		</View>
	);
}

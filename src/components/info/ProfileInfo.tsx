import { UserService } from '@/src/api/services/UserService';
import { ConversationService } from '@/src/api/services/ConversationService';
import { useUser } from '@/src/contexts/user/UserContext';
import { Conversation } from '@/src/models/Conversation';
import React, { useEffect, useState, useCallback } from 'react';
import { Image, Text, View, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SocketService from '@/src/api/services/SocketService';
import Toast from '@/src/components/ui/Toast';
import { pickAvatar } from '@/src/utils/ImagePicker';
import { AuthStorage } from '@/src/storage/AuthStorage';
import axios from 'axios';

interface ProfileInfoProps {
    conversation: Conversation | null;
    onConversationUpdate?: (updatedConversation: Conversation) => void;
}

export default function ProfileInfo({conversation, onConversationUpdate}: ProfileInfoProps) {
    // State variables
    const {user} = useUser();
    const [avatarUrl, setAvatarUrl] = useState<string>('https://example.com/default-avatar.png');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [conversationName, setConversationName] = useState<string>('');
    const [toast, setToast] = useState({
        visible: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });
    
    const socketService = SocketService.getInstance();

    // Check if current user is admin or moderator
    const isAdminOrMod = conversation?.participantInfo?.find(
        p => p.id === user?.id && (p.role === 'admin' || p.role === 'mod')
    );

    // Set initial conversation name
    useEffect(() => {
        if (conversation) {
            setConversationName(conversation.name);
        }
    }, [conversation?.id, conversation?.name]);

    useEffect(() => {
        const getConversationAvatar = async (conversation: Conversation | null) => {
            if (!conversation) return;
            if (!conversation.isGroup && conversation.participantIds.length < 3) {
                const otherParticipantId = conversation.participantIds.find((id) => id !== user?.id);
                const otherParticipant = await UserService.getUserById(otherParticipantId || '');
                if (otherParticipant.success && otherParticipant.user) {
                    setAvatarUrl(otherParticipant.user.avatarURL || 'https://example.com/default-avatar.png');
                }
            } else {
                setAvatarUrl(conversation.avatarUrl || 'https://example.com/default-avatar.png');
            }
        };
        getConversationAvatar(conversation);
    }, [conversation]);

    // Reset modal state when opened
    useEffect(() => {
        if (showRenameModal && conversation) {
            setNewGroupName(conversation.name);
            setErrorMessage(null);
        }
    }, [showRenameModal]);

    // Socket event handler for receiving rename updates
    const handleConversationRenamed = useCallback((data: { conversationId: string, newName: string }) => {
        if (conversation && data.conversationId === conversation.id) {
            console.log('Received conversation rename event:', data);
            setConversationName(data.newName);
            
            // Update the parent component if callback is provided
            if (onConversationUpdate && conversation) {
                const updatedConversation = {
                    ...conversation,
                    name: data.newName
                };
                onConversationUpdate(updatedConversation);
            }
        }
    }, [conversation, onConversationUpdate]);

    // Set up and clean up socket listeners
    useEffect(() => {
        socketService.onConversationRenamed(handleConversationRenamed);
        
        return () => {
            socketService.removeConversationRenamedListener(handleConversationRenamed);
        };
    }, [handleConversationRenamed]);

    // Function to handle avatar upload
    const dataURItoBlob = (dataURI: string): Blob => {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: mimeString});
    }
    
    const processImageUri = async (uri: string, fileName: string): Promise<FormData> => {
        const formData = new FormData();
        
        if (Platform.OS === 'web') {
            if (uri.startsWith('data:')) {
                const blob = dataURItoBlob(uri);
                const file = new File([blob], fileName, { type: blob.type });
                formData.append('avatar', file);
            }
        } else {
            // React Native: Use file URI directly
            formData.append(
                'avatar', 
                {
                    uri: uri,
                    name: fileName,
                    type: `image/${fileName.split('.').pop()}`
                } as any
            );
        }
        
        return formData;
    };
    
    const handlePickAvatar = async () => {
        // Only allow admin or moderator to change group avatar
        if (!isAdminOrMod || !conversation?.isGroup) return;
        
        const result = await pickAvatar();
        if (result.success) {
            try {
                setIsLoading(true);
                const formData = await processImageUri(result.uri || '', 'group-avatar.jpg');
                
                const token = await AuthStorage.getAccessToken();
                const response = await axios.put(`/conversations/update-avatar/${conversation.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.status === 200 && response.data.success) {
                    const newAvatarUrl = response.data.data.avatarUrl;
                    setAvatarUrl(newAvatarUrl);
                    
                    // Update parent component
                    if (onConversationUpdate && conversation) {
                        const updatedConversation = {
                            ...conversation,
                            avatarUrl: newAvatarUrl
                        };
                        onConversationUpdate(updatedConversation);
                    }
                    
                    setToast({
                        visible: true,
                        message: 'Cập nhật ảnh nhóm thành công!',
                        type: 'success'
                    });
                    
                    // Emit socket event to notify other clients
                    socketService.updateConversationAvatar({
                        conversationId: conversation.id,
                        newAvatarUrl: newAvatarUrl
                    });
                } else {
                    setToast({
                        visible: true,
                        message: 'Cập nhật ảnh nhóm thất bại!',
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('Error updating group avatar:', error);
                setToast({
                    visible: true,
                    message: 'Cập nhật ảnh nhóm thất bại!',
                    type: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRenameGroup = async () => {
        if (!conversation) return;
        
        // Validate input
        if (!newGroupName.trim()) {
            setErrorMessage("Tên nhóm không được để trống");
            return;
        }
        
        // If name hasn't changed, just close the modal
        if (newGroupName.trim() === conversation.name) {
            setShowRenameModal(false);
            return;
        }
        
        setIsLoading(true);
        setErrorMessage(null);
        
        try {
            // Update conversation with the new name via API
            const response = await ConversationService.updateConversation(
                conversation.id, 
                { ...conversation, name: newGroupName.trim() }
            );
            
            if (response.success) {
                // Emit socket event for real-time update to all clients
                socketService.updateConversationName({
                    conversationId: conversation.id,
                    newName: newGroupName.trim()
                });
                
                // Update local state
                setConversationName(newGroupName.trim());
                
                // Update parent component if callback exists
                if (onConversationUpdate) {
                    onConversationUpdate({
                        ...conversation,
                        name: newGroupName.trim()
                    });
                }
                
                // Close modal
                setShowRenameModal(false);
            } else {
                setErrorMessage(response.message || "Không thể đổi tên nhóm");
            }
        } catch (error) {
            console.error("Error renaming group:", error);
            setErrorMessage("Đã xảy ra lỗi khi đổi tên nhóm");
        } finally {
            setIsLoading(false);
        }
    };

    const name = conversation?.isGroup 
        ? conversationName || conversation?.name 
        : conversation?.participantInfo && conversation.participantInfo.length > 0 
        ? conversation.participantInfo.find(p => p.id !== user?.id)?.name || "Người dùng"
            : "Người dùng";
    const isGroup = conversation?.isGroup || false;
    const isOnline = conversation?.participantInfo?.some(p => p.id !== user?.id && p.isOnline) || false;
    const memberCount = conversation?.participantInfo?.length || 0;
    
    return (
        <View className="items-center pt-8 pb-6 border-b-4 border-gray-200">
            <View className="mb-4 relative">
                <TouchableOpacity
                    onPress={isGroup && isAdminOrMod ? handlePickAvatar : undefined}
                    disabled={!isGroup || !isAdminOrMod || isLoading}
                    className={`w-24 h-24 rounded-full bg-gradient-to-b from-blue-100 to-blue-200 items-center justify-center 
                        ${isGroup && isAdminOrMod ? 'active:opacity-70' : ''}`}
                >
                    <Image
                        source={{uri: avatarUrl || 'https://example.com/default-avatar.png'}}
                        className="w-24 h-24 rounded-full border-[2.5px] border-white"
                    />
                    {isGroup && isAdminOrMod && (
                        <View className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                            <Ionicons name="camera" size={16} color="#3b82f6" />
                        </View>
                    )}
                </TouchableOpacity>
                {!isGroup && isOnline && (
                    <View
                        className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-[2.5px] border-white shadow-sm"/>
                )}
            </View>
            
            {/* Name with Edit button for groups */}
            <View className="flex-row items-center">
                <Text className="text-[17px] font-semibold text-blue-950">{name}</Text>
                
                {isGroup && isAdminOrMod && (
                    <TouchableOpacity 
                        onPress={() => setShowRenameModal(true)}
                        className="ml-2 p-1"
                    >
                        <Ionicons name="pencil-outline" size={16} color="#3b82f6" />
                    </TouchableOpacity>
                )}
            </View>
            
            <Text className="text-sm text-blue-500 mt-1">
                {isGroup
                    ? `${memberCount || 0} thành viên`
                    : isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </Text>

            {/* Rename Group Modal */}
            <Modal
                visible={showRenameModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRenameModal(false)}
            >
                <View className="flex-1 bg-black/30 justify-center items-center">
                    <View className="bg-white rounded-xl w-[90%] max-w-md p-5 shadow-lg">
                        <Text className="text-lg font-semibold text-center mb-4">Đổi tên nhóm</Text>
                        
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                            value={newGroupName}
                            onChangeText={setNewGroupName}
                            placeholder="Nhập tên nhóm mới"
                            autoFocus={Platform.OS !== 'ios'} // Avoid auto-focus on iOS due to keyboard animation issues
                        />
                        
                        {errorMessage && (
                            <Text className="text-red-500 text-sm mb-3">{errorMessage}</Text>
                        )}
                        
                        <View className="flex-row justify-end mt-2">
                            <TouchableOpacity 
                                onPress={() => setShowRenameModal(false)}
                                className="px-4 py-2 mr-2"
                            >
                                <Text className="text-gray-600">Hủy</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={handleRenameGroup}
                                disabled={isLoading}
                                className={`px-4 py-2 rounded-lg ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
                            >
                                <Text className="text-white">{isLoading ? 'Đang lưu...' : 'Lưu'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            
            {/* Toast message */}
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({...prev, visible: false}))}
                duration={3000}
            />
        </View>
    );
}
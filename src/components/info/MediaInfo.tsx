import React, { useState, useEffect, useRef } from 'react';
import { Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageService } from '@/src/api/services/MessageService';
import { AttachmentService } from '@/src/api/services/AttachmentService';
import { MessageType, Message } from '@/src/models/Message';
import { Attachment } from '@/src/models/Attachment';
import SocketService from '@/src/api/services/SocketService';

interface MediaItem {
    id: string;
    url: string;
    type: 'image' | 'video';
    date: string;
    fileName: string;
}

interface MediaInfoProps {
    conversationId?: string;
    onViewAll?: () => void;
    onPreviewMedia?: (url: string, type: string) => void;
}

export default function MediaInfo({ conversationId, onViewAll, onPreviewMedia }: MediaInfoProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketService = useRef(SocketService.getInstance()).current;

    useEffect(() => {
        if (conversationId) {
            fetchMediaItems();
            
            // Setup socket listener for new messages
            const handleNewMessage = async (message: Message) => {
                // Only process messages for this conversation that might contain media
                if (message.conversationId === conversationId && message.type === MessageType.FILE) {
                    try {
                        const attachmentResponse = await AttachmentService.getAttachmentByMessageId(message.id);
                        
                        if (attachmentResponse.success && attachmentResponse.data && attachmentResponse.data.length > 0) {
                            const attachment = attachmentResponse.data[0];
                            
                            // Check if this is an image or video
                            if (attachment.fileType && (
                                attachment.fileType.startsWith('image/') || 
                                attachment.fileType.startsWith('video/')
                            )) {
                                const newMediaItem: MediaItem = {
                                    id: attachment.id,
                                    url: attachment.url,
                                    type: attachment.fileType.startsWith('image/') ? 'image' : 'video',
                                    date: new Date(message.sentAt).toLocaleDateString('vi-VN'),
                                    fileName: attachment.fileName
                                };
                                
                                // Add the new media item to the list
                                setMediaItems(prevItems => [newMediaItem, ...prevItems]);
                            }
                        }
                    } catch (error) {
                        console.error("Error processing new media message:", error);
                    }
                }
            };
            
            // Also listen for attachment sent event for more immediate feedback
            const handleAttachmentSent = async (data: { success: boolean, messageId: string }) => {
                if (data.success) {
                    try {
                        const messageResponse = await MessageService.getMessages(conversationId);
                        if (messageResponse.success) {
                            const message = messageResponse.messages.find(m => m.id === data.messageId);
                            if (message) {
                                handleNewMessage(message);
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching message after attachment sent:", error);
                    }
                }
            };
            
            // Register socket listeners
            socketService.onNewMessage(handleNewMessage);
            // socketService.onAttachmentSent(handleAttachmentSent);
            
            // Cleanup function to remove listeners
            return () => {
                socketService.removeMessageListener(handleNewMessage);
                // socketService.removeAttachmentSentListener(handleAttachmentSent);
            };
        }
    }, [conversationId]);

    const fetchMediaItems = async () => {
        if (!conversationId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Lấy tất cả tin nhắn của conversation
            const response = await MessageService.getMessages(conversationId);
            
            if (response.success) {
                // Lọc các tin nhắn có type là FILE (có thể chứa hình ảnh hoặc video)
                const mediaMessages = response.messages.filter(
                    msg => msg.type === MessageType.FILE
                );
                
                // Nếu không có tin nhắn media nào
                if (mediaMessages.length === 0) {
                    setMediaItems([]);
                    setLoading(false);
                    return;
                }
                
                // Lấy thông tin attachment cho mỗi message
                const mediaPromises = mediaMessages.map(async (message) => {
                    try {
                        const attachmentResponse = await AttachmentService.getAttachmentByMessageId(message.id);
                        
                        if (attachmentResponse.success && attachmentResponse.data && attachmentResponse.data.length > 0) {
                            // Dựa trên cấu trúc từ hình ảnh đã cung cấp
                            const attachment: Attachment = attachmentResponse.data[0];
                            
                            // Chỉ lấy các file hình ảnh/video dựa vào fileType
                            if (attachment.fileType) {
                                if (attachment.fileType.startsWith('image/')) {
                                    return {
                                        id: attachment.id,
                                        url: attachment.url,
                                        type: 'image' as const,
                                        date: new Date(message.sentAt).toLocaleDateString('vi-VN'),
                                        fileName: attachment.fileName
                                    };
                                } else if (attachment.fileType.startsWith('video/')) {
                                    return {
                                        id: attachment.id,
                                        url: attachment.url,
                                        type: 'video' as const,
                                        date: new Date(message.sentAt).toLocaleDateString('vi-VN'),
                                        fileName: attachment.fileName
                                    };
                                }
                            }
                            return null;
                        }
                        return null;
                    } catch (error) {
                        console.error("Error fetching attachment:", error);
                        return null;
                    }
                });
                
                const fetchedMediaItems = (await Promise.all(mediaPromises)).filter(item => item !== null) as MediaItem[];
                setMediaItems(fetchedMediaItems);
            } else {
                setError(response.statusMessage || "Không thể tải danh sách media");
            }
        } catch (error) {
            console.error("Error fetching media:", error);
            setError("Đã xảy ra lỗi khi tải danh sách media");
        } finally {
            setLoading(false);
        }
    };

    const handleMediaPress = (item: MediaItem) => {
        if (onPreviewMedia) {
            onPreviewMedia(item.url, item.type);
        }
    };

    // Hiển thị tối đa 6 media items trong grid (2x3)
    const visibleItems = mediaItems.slice(0, 6);

    return (
        <View className="px-4 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-blue-950">Ảnh/Video đã chia sẻ</Text>
                {mediaItems.length > 6 && (
                    <TouchableOpacity
                        className="py-1 px-3 rounded-lg bg-blue-50 active:bg-blue-100"
                        onPress={onViewAll}
                    >
                        <Text className="text-blue-500">Xem tất cả</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {loading ? (
                <View className="items-center py-10">
                    <ActivityIndicator color="#3B82F6" />
                </View>
            ) : error ? (
                <View className="items-center py-10">
                    <Text className="text-red-500">{error}</Text>
                </View>
            ) : mediaItems.length === 0 ? (
                <View className="items-center py-10">
                    <Ionicons name="images-outline" size={48} color="#CBD5E1" />
                    <Text className="text-slate-400 mt-2">Chưa có ảnh hoặc video nào được chia sẻ</Text>
                </View>
            ) : (
                <View className="flex-row flex-wrap -mx-1">
                    {visibleItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="w-[32%] aspect-square p-1"
                            onPress={() => handleMediaPress(item)}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    source={{ uri: item.url }}
                                    className="w-full h-full rounded-xl"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-full h-full rounded-xl bg-blue-100 items-center justify-center">
                                    <View className="absolute w-full h-full">
                                        <Image
                                            source={{ uri: item.url }} // Ideally this would be a video thumbnail
                                            className="w-full h-full rounded-xl opacity-80"
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View className="bg-blue-500/70 w-8 h-8 rounded-full items-center justify-center">
                                        <Ionicons name="play" size={18} color="white" />
                                    </View>
                                </View>
                            )}
                            {item.type === 'video' && (
                                <View className="absolute bottom-2 right-2 bg-black/60 px-1.5 rounded-sm">
                                    <Ionicons name="videocam" size={12} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}
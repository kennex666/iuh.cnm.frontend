import React, { useState, useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageService } from '@/src/api/services/MessageService';
import { AttachmentService } from '@/src/api/services/AttachmentService';
import { MessageType, Message } from '@/src/models/Message';
import formatFileSize from '@/src/utils/formatFileSize';
import { Attachment } from '@/src/models/Attachment';
import SocketService from '@/src/api/services/SocketService';

interface File {
    id: string;
    name: string;
    size: string;
    type: string;
    date: string;
    url: string;
}

interface FilesInfoProps {
    conversationId?: string;
    onViewAll?: () => void;
}

export default function FilesInfo({ conversationId, onViewAll }: FilesInfoProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const socketService = useRef(SocketService.getInstance()).current;

    useEffect(() => {
        if (conversationId) {
            console.log("Fetching files for conversation:", conversationId);
            fetchFiles();
            
            // Setup socket listener for new messages
            const handleNewMessage = async (message: Message) => {
                // Only process messages for this conversation that are files
                if (message.conversationId === conversationId && message.type === MessageType.FILE) {
                    try {
                        const attachmentResponse = await AttachmentService.getAttachmentByMessageId(message.id);
                        
                        if (attachmentResponse.success && attachmentResponse.data && attachmentResponse.data.length > 0) {
                            const attachment = attachmentResponse.data[0];
                            
                            // Skip images and videos
                            if (attachment.fileType && (
                                attachment.fileType.startsWith('image/') || 
                                attachment.fileType.startsWith('video/')
                            )) {
                                return;
                            }
                            
                            // Create new file object
                            const fileExtension = attachment.fileName.split('.').pop()?.toLowerCase() || '';
                            const newFile: File = {
                                id: attachment.id,
                                name: attachment.fileName,
                                size: formatFileSize(attachment.size),
                                type: fileExtension,
                                date: new Date(message.sentAt).toLocaleDateString('vi-VN'),
                                url: attachment.url
                            };
                            
                            // Add the new file to the list
                            setFiles(prevFiles => [newFile, ...prevFiles]);
                        }
                    } catch (error) {
                        console.error("Error processing new file message:", error);
                    }
                }
            };
            
            // Also listen for attachment sent event
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

    const fetchFiles = async () => {
        if (!conversationId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Lấy tất cả tin nhắn của conversation
            const response = await MessageService.getMessages(conversationId);
            
            if (response.success) {
                // Lọc các tin nhắn có type là FILE
                const fileMessages = response.messages.filter(msg => msg.type === MessageType.FILE);
                
                // Nếu không có tin nhắn file nào
                if (fileMessages.length === 0) {
                    setFiles([]);
                    setLoading(false);
                    return;
                }
                
                // Lấy thông tin attachment cho mỗi message
                const filePromises = fileMessages.map(async (message) => {
                    try {
                        const attachmentResponse = await AttachmentService.getAttachmentByMessageId(message.id);
                        
                        if (attachmentResponse.success && attachmentResponse.data && attachmentResponse.data.length > 0) {
                            // Dựa trên cấu trúc từ hình ảnh đã cung cấp
                            const attachment: Attachment = attachmentResponse.data[0];
                            
                            // Lọc bỏ các file hình ảnh/video dựa vào fileType
                            if (attachment.fileType && (
                                attachment.fileType.startsWith('image/') || 
                                attachment.fileType.startsWith('video/')
                            )) {
                                return null;
                            }
                            
                            // Lấy phần mở rộng từ tên file
                            const fileExtension = attachment.fileName.split('.').pop()?.toLowerCase() || '';
                            
                            return {
                                id: attachment.id,
                                name: attachment.fileName,
                                size: formatFileSize(attachment.size),
                                type: fileExtension,
                                date: new Date(message.sentAt).toLocaleDateString('vi-VN'),
                                url: attachment.url
                            };
                        }
                        return null;
                    } catch (error) {
                        console.error("Error fetching attachment:", error);
                        return null;
                    }
                });
                
                const fetchedFiles = (await Promise.all(filePromises)).filter(file => file !== null) as File[];
                setFiles(fetchedFiles);
            } else {
                setError(response.statusMessage || "Không thể tải danh sách file");
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            setError("Đã xảy ra lỗi khi tải danh sách file");
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (type: string) => {
        const lowerType = type.toLowerCase();
        switch (lowerType) {
            case 'pdf':
                return 'document-text-outline';
            case 'doc':
            case 'docx':
                return 'document-outline';
            case 'xls':
            case 'xlsx':
                return 'grid-outline';
            case 'zip':
            case 'rar':
            case '7z':
                return 'folder-outline';
            case 'txt':
                return 'text-outline';
            case 'ppt':
            case 'pptx':
                return 'easel-outline';
            default:
                return 'document-outline';
        }
    };

    const handleDownload = (fileUrl: string, fileName: string) => {
        // Implement download functionality
        console.log(`Downloading file: ${fileName} from ${fileUrl}`);
        // On web, you could use window.open(fileUrl)
        // On mobile, you'd need to use Expo FileSystem or similar
    };

    // Hiển thị tối đa 4 file, phần còn lại sẽ hiển thị trong "Xem tất cả"
    const visibleFiles = files.slice(0, 4);

    return (
        <View className="px-4 pt-6 pb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-blue-950">File đã chia sẻ</Text>
                {files.length > 4 && (
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
            ) : files.length === 0 ? (
                <View className="items-center py-10">
                    <Ionicons name="document-outline" size={48} color="#CBD5E1" />
                    <Text className="text-slate-400 mt-2">Chưa có file nào được chia sẻ</Text>
                </View>
            ) : (
                <View className="space-y-2">
                    {visibleFiles.map((file, index) => (
                        <View key={index} className="bg-blue-50/50 p-3.5 rounded-xl flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                                    <Ionicons name={getFileIcon(file.type)} size={20} color="#3B82F6"/>
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-[15px] text-blue-950" numberOfLines={1}>
                                        {file.name}
                                    </Text>
                                    <View className="flex-row items-center mt-0.5">
                                        <Text className="text-sm text-blue-500">{file.size}</Text>
                                        <Text className="text-sm text-blue-400 mx-1.5">•</Text>
                                        <Text className="text-sm text-blue-500">{file.date}</Text>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="w-9 h-9 bg-blue-100 rounded-lg items-center justify-center ml-3 active:bg-blue-200"
                                onPress={() => handleDownload(file.url, file.name)}
                            >
                                <Ionicons name="download-outline" size={18} color="#3B82F6"/>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageService } from '@/src/api/services/MessageService';
import { AttachmentService } from '@/src/api/services/AttachmentService';
import { Message, MessageType } from '@/src/models/Message';
import { Attachment } from '@/src/models/Attachment';
import formatFileSize from '@/src/utils/formatFileSize';

// Props interface for Search component
interface SearchProps {
    isVisible: boolean;
    onClose: () => void;
    conversationId: string;
    onSelectMessage?: (messageId: string) => void;
}

// Search result with combined types
interface SearchResult {
    message: Message;
    attachment?: Attachment;
    type: 'message' | 'file' | 'image' | 'video';
    title: string;
    subtitle?: string;
    timestamp: string;
    url?: string;
}

export default function Search({ isVisible, onClose, conversationId, onSelectMessage }: SearchProps) {
    // State management
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'messages' | 'files' | 'media'>('all');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    // Reset search when visibility changes
    useEffect(() => {
        if (!isVisible) {
            setSearchText('');
            setSearchResults([]);
        }
    }, [isVisible]);

    // Debounced search function
    useEffect(() => {
        if (searchText.length >= 2 && isVisible) {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            
            debounceTimeout.current = setTimeout(() => {
                performSearch(searchText);
            }, 500);
        } else if (searchText.length === 0) {
            setSearchResults([]);
        }
        
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [searchText, conversationId, isVisible]);

    // Main search function
    const performSearch = async (query: string) => {
        if (!conversationId || !query) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // Get messages matching the search query
            const response = await MessageService.searchMessages(conversationId, query);
            
            if (!response.success) {
                setError(response.statusMessage);
                setSearchResults([]);
                return;
            }
            
            // Process results and categorize them
            const results = await processSearchResults(response.messages);
            setSearchResults(results);
            
        } catch (error) {
            console.error("Search error:", error);
            setError("An error occurred while searching");
        } finally {
            setLoading(false);
        }
    };

    // Process search results and fetch attachments for file messages
    const processSearchResults = async (messages: Message[]): Promise<SearchResult[]> => {
        const results: SearchResult[] = [];
        
        for (const message of messages) {
            // Format timestamp
            const timestamp = formatMessageTimestamp(new Date(message.sentAt));
            
            // Handle different message types
            if (message.type === MessageType.TEXT) {
                // Text message
                results.push({
                    message,
                    type: 'message',
                    title: message.content,
                    timestamp,
                });
            } 
            else if (message.type === MessageType.FILE || 
                     message.type === MessageType.IMAGE ||
                     message.type === MessageType.VIDEO) {
                
                // Fetch attachment details
                try {
                    const attachmentResponse = await AttachmentService.getAttachmentByMessageId(message.id);
                    
                    if (attachmentResponse.success && attachmentResponse.data && attachmentResponse.data.length > 0) {
                        const attachment = attachmentResponse.data[0];
                        
                        // Determine file type
                        const fileType = determineFileType(attachment.fileType, attachment.fileName);
                        const formattedSize = formatFileSize(attachment.size);
                        
                        results.push({
                            message,
                            attachment,
                            type: fileType,
                            title: attachment.fileName,
                            subtitle: formattedSize,
                            timestamp,
                            url: attachment.url,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching attachment:", error);
                }
            }
        }
        
        return results;
    };

    // Determine file type from MIME type or file extension
    const determineFileType = (fileType: string, fileName: string): 'file' | 'image' | 'video' => {
        if (!fileType) {
            // Fallback to file extension
            const extension = fileName.split('.').pop()?.toLowerCase();
            if (extension && ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                return 'image';
            } else if (extension && ['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
                return 'video';
            } else {
                return 'file';
            }
        }
        
        if (fileType.startsWith('image/')) {
            return 'image';
        } else if (fileType.startsWith('video/')) {
            return 'video';
        } else {
            return 'file';
        }
    };

    // Format message timestamp for display
    const formatMessageTimestamp = (date: Date): string => {
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            // Today - show time
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Hôm qua';
        } else if (diffDays < 7) {
            // Within the last week
            const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            return days[date.getDay()];
        } else {
            // Older than a week
            return date.toLocaleDateString('vi-VN');
        }
    };

    // Get appropriate icon for file type
    const getFileIcon = (fileType: string): string => {
        const extension = fileType.split('/').pop()?.toLowerCase() || fileType;
        
        switch (extension) {
            case 'pdf':
                return 'document-text-outline';
            case 'doc':
            case 'docx':
            case 'msword':
                return 'document-outline';
            case 'xls':
            case 'xlsx':
            case 'sheet':
                return 'grid-outline';
            case 'zip':
            case 'rar':
            case '7z':
                return 'folder-outline';
            case 'txt':
            case 'text':
                return 'text-outline';
            case 'ppt':
            case 'pptx':
            case 'presentation':
                return 'easel-outline';
            default:
                return 'document-outline';
        }
    };

    // Handle selecting a search result
    const handleSelectResult = (result: SearchResult) => {
        if (onSelectMessage) {
            onSelectMessage(result.message.id);
        }
        onClose();
    };

    // Empty state for search
    if (!isVisible) return null;

    return (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-white z-50">
            {/* Search header */}
            <View className="h-14 px-4 border-b border-gray-200 flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-4">
                    <Ionicons name="search-outline" size={20} color="#666"/>
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Tìm kiếm trong cuộc trò chuyện"
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#666"/>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={onClose}>
                    <Text className="text-blue-500">Đóng</Text>
                </TouchableOpacity>
            </View>

            {/* Filter tabs */}
            <View className="flex-row border-b border-gray-200">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'messages', label: 'Tin nhắn' },
                    { id: 'files', label: 'Files' },
                    { id: 'media', label: 'Media' }
                ].map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 ${activeTab === tab.id ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Text
                            className={`text-center ${
                                activeTab === tab.id ? 'text-blue-500 font-medium' : 'text-gray-600'
                            }`}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Search results */}
            <ScrollView className="flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <ActivityIndicator color="#3B82F6" size="large" />
                        <Text className="text-gray-500 mt-2">Đang tìm kiếm...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                        <Text className="text-red-500 mt-2">{error}</Text>
                    </View>
                ) : searchText.length < 2 ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <Text className="text-gray-500">Nhập ít nhất 2 ký tự để tìm kiếm</Text>
                    </View>
                ) : searchResults.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-8">
                        <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                        <Text className="text-gray-500 mt-2">Không tìm thấy kết quả nào</Text>
                    </View>
                ) : (
                    // Filter results based on selected tab
                    searchResults
                        .filter((result) => {
                            if (activeTab === 'all') return true;
                            if (activeTab === 'messages') return result.type === 'message';
                            if (activeTab === 'files') return result.type === 'file';
                            if (activeTab === 'media') return ['image', 'video'].includes(result.type);
                            return true;
                        })
                        .map((result, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row items-center px-4 py-3 border-b border-gray-100"
                                onPress={() => handleSelectResult(result)}
                            >
                                {/* Icon or thumbnail */}
                                {result.type === 'message' && (
                                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                                        <Ionicons name="chatbubble-outline" size={20} color="#666"/>
                                    </View>
                                )}
                                {result.type === 'file' && (
                                    <View className="w-10 h-10 rounded-lg bg-gray-100 items-center justify-center">
                                        <Ionicons name={getFileIcon(result.attachment?.fileType || '')} size={20} color="#666"/>
                                    </View>
                                )}
                                {['image', 'video'].includes(result.type) && (
                                    <View className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                        {result.url ? (
                                            <Image
                                                source={{uri: result.url}}
                                                className="w-10 h-10"
                                            />
                                        ) : (
                                            <View className="w-10 h-10 items-center justify-center">
                                                <Ionicons 
                                                    name={result.type === 'image' ? 'image-outline' : 'videocam-outline'} 
                                                    size={20} 
                                                    color="#666"
                                                />
                                            </View>
                                        )}
                                    </View>
                                )}

                                {/* Content */}
                                <View className="flex-1 ml-3">
                                    <Text className="text-gray-900 font-medium" numberOfLines={1}>
                                        {result.title}
                                    </Text>
                                    {result.subtitle && (
                                        <Text className="text-gray-500 text-sm">{result.subtitle}</Text>
                                    )}
                                </View>

                                {/* Timestamp */}
                                <Text className="text-gray-500 text-sm">{result.timestamp}</Text>
                            </TouchableOpacity>
                        ))
                )}
            </ScrollView>
        </View>
    );
}
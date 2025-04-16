import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { Attachment } from '@/src/models/Attachment';

interface FileMessageContentProps {
    messageId: string;
    fileName: string;
    isSender: boolean;
    getAttachment: (messageId: string) => Promise<Attachment | null>;
    onImagePress: (url: string) => void;
}

const FileMessageContent = ({ messageId, fileName, isSender, getAttachment, onImagePress }: FileMessageContentProps) => {
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttachment = async () => {
            setLoading(true);
            const result = await getAttachment(messageId);
            if (result) {
                setAttachment(result);
            }
            setLoading(false);
        };
        
        fetchAttachment();
    }, [messageId]);

    const isImage = attachment?.fileType && attachment.fileType.startsWith('image/');
    
    const getFileIcon = (fileType: string | undefined): string => {
        if (!fileType) return 'document-outline';
        
        if (fileType.startsWith('image/')) return 'image-outline';
        if (fileType.startsWith('video/')) return 'videocam-outline';
        if (fileType.startsWith('audio/')) return 'musical-notes-outline';
        if (fileType.includes('pdf')) return 'document-text-outline';
        if (fileType.includes('word') || fileType.includes('document')) return 'document-text-outline';
        if (fileType.includes('excel') || fileType.includes('sheet')) return 'grid-outline';
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'easel-outline';
        if (fileType.includes('zip') || fileType.includes('compressed')) return 'archive-outline';
        
        return 'document-outline';
    };

    if (loading) {
        return (
            <View className="flex-row items-center">
                <View className="w-10 h-10 rounded bg-white/20 items-center justify-center mr-2">
                    <Ionicons
                        name="hourglass-outline"
                        size={24}
                        color={isSender ? 'white' : '#666'}
                    />
                </View>
                <View className="flex-1">
                    <Text
                        className={`${isSender ? 'text-white' : 'text-gray-900'} font-medium`}
                        numberOfLines={1}
                    >
                        {fileName}
                    </Text>
                    <Text className={`text-xs mt-1 ${isSender ? 'text-white/70' : 'text-gray-500'}`}>
                        Đang tải...
                    </Text>
                </View>
            </View>
        );
    }

    if (isImage && attachment?.url) {
        return (
            <TouchableOpacity
                onPress={() => onImagePress(attachment.url)}
                className="w-full"
                activeOpacity={0.9}
            >
                <Image
                    source={{ uri: attachment.url }}
                    className="rounded-lg"
                    style={{ width: '100%', minWidth: 200, height: 200 }}
                    resizeMode="cover"
                />
                <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-full flex-row items-center">
                    <Text className="text-white text-xs">{fileName}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View className="flex-row items-center">
            <View className="w-10 h-10 rounded bg-white/20 items-center justify-center mr-2">
                <Ionicons
                    name={getFileIcon(attachment?.fileType)}
                    size={24}
                    color={isSender ? 'white' : '#666'}
                />
            </View>
            <View className="flex-1">
                <Text
                    className={`${isSender ? 'text-white' : 'text-gray-900'} font-medium`}
                    numberOfLines={1}
                >
                    {fileName}
                </Text>
                <TouchableOpacity
                    className={`mt-1 ${isSender ? 'bg-white/20' : 'bg-gray-200'} rounded px-2 py-1`}
                    onPress={() => {
                        if (attachment?.url) {
                            Linking.openURL(attachment.url);
                        }
                    }}
                >
                    <Text className={`text-xs ${isSender ? 'text-white' : 'text-blue-600'}`}>
                        Mở file
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default FileMessageContent;
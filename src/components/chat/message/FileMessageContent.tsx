import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, Linking, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Attachment} from '@/src/models/Attachment';
import {ResizeMode, Video} from 'expo-av';

interface FileMessageContentProps {
    messageId: string;
    fileName: string;
    isSender: boolean;
    getAttachment: (messageId: string) => Promise<Attachment | null>;
    onImagePress: (url: string) => void;
}

type GLYPHS = keyof typeof Ionicons.glyphMap;

const FileMessageContent = ({messageId, fileName, isSender, getAttachment, onImagePress}: FileMessageContentProps) => {
    const [attachment, setAttachment] = useState<Attachment | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [mediaDimensions, setMediaDimensions] = useState({width: 200, height: 200});
    const videoRef = useRef<Video>(null);

    const MAX_HEIGHT = 600; // Chiều cao tối đa cho media
    const screenWidth = Dimensions.get('window').width;
    const maxContentWidth = screenWidth * 0.4; // 40% chiều rộng màn hình

    useEffect(() => {
        const fetchAttachment = async () => {
            setLoading(true);
            const result = await getAttachment(messageId);
            console.log(`Fetched attachment with URL: ${result?.url}`);
            if (result) {
                setAttachment(result);
                // Tính toán kích thước cho media
                if (result.fileType?.startsWith('image/') || result.fileType?.startsWith('video/')) {
                    calculateDimensions(result);
                }
            }
            setLoading(false);
        };

        fetchAttachment();
    }, [messageId]);

    const calculateDimensions = async (attachment: Attachment) => {
        try {
            const getSize = () => {
                return new Promise<{ width: number, height: number }>((resolve) => {
                    if (attachment.fileType?.startsWith('image/')) {
                        // Đối với hình ảnh, sử dụng Image.getSize để lấy kích thước thực
                        Image.getSize(
                            attachment.url,
                            (width, height) => {
                                resolve({width, height});
                            },
                            () => {
                                // Fallback nếu không lấy được kích thước
                                resolve({width: maxContentWidth, height: maxContentWidth * 0.75});
                            }
                        );
                    } else if (attachment.fileType?.startsWith('video/')) {
                        // Đối với video, sử dụng tỉ lệ mặc định 16:9 hoặc 9:16 tùy thuộc vào orientation
                        // Giả sử đây là video dọc (portrait) như bạn đề cập (720x1280)
                        resolve({width: 720, height: 1280});
                    } else {
                        resolve({width: maxContentWidth, height: maxContentWidth * 0.75});
                    }
                });
            };

            const {width, height} = await getSize();

            let newWidth, newHeight;

            // Tính toán tỉ lệ và kích thước mới dựa vào tỉ lệ khung hình
            if (width >= height) {
                // Landscape orientation (ngang)
                newWidth = Math.min(maxContentWidth, width);
                newHeight = (height / width) * newWidth;

                // Kiểm tra nếu chiều cao vẫn vượt quá MAX_HEIGHT
                if (newHeight > MAX_HEIGHT) {
                    const ratio = MAX_HEIGHT / newHeight;
                    newHeight = MAX_HEIGHT;
                    newWidth = newWidth * ratio;
                }
            } else {
                // Portrait orientation (dọc)
                newHeight = Math.min(MAX_HEIGHT, height);
                newWidth = (width / height) * newHeight;

                // Kiểm tra nếu chiều rộng vẫn vượt quá maxContentWidth
                if (newWidth > maxContentWidth) {
                    const ratio = maxContentWidth / newWidth;
                    newWidth = maxContentWidth;
                    newHeight = newHeight * ratio;
                }
            }

            // Đảm bảo kích thước tối thiểu
            if (newWidth < 120) newWidth = 120;
            if (newHeight < 120) newHeight = 120;

            setMediaDimensions({width: newWidth, height: newHeight});
        } catch (error) {
            console.error('Error calculating dimensions:', error);
            // Sử dụng kích thước mặc định nếu có lỗi
            setMediaDimensions({width: maxContentWidth, height: (maxContentWidth * 9) / 16});
        }
    };

    const handleVideoPress = async () => {
        if (!videoRef.current) return;

        try {
            const status = await videoRef.current.getStatusAsync();

            if (status.isLoaded) {
                if (status.isPlaying) {
                    await videoRef.current.pauseAsync();
                    setIsPlaying(false);
                } else {
                    await videoRef.current.playAsync();
                    setIsPlaying(true);
                }
            } else {
                console.error('Video không thể phát:', status);
            }
        } catch (error) {
            console.error('Lỗi khi phát/tạm dừng video:', error);
        }
    };

    const onVideoStatusUpdate = (status: any) => {
        if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
        }
    };

    const isImage = attachment?.fileType && attachment.fileType.startsWith('image/');
    const isVideo = attachment?.fileType && attachment.fileType.startsWith('video/');

    const getFileIcon = (fileType: string | undefined): GLYPHS => {
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

    // Xử lý hiển thị hình ảnh
    if (isImage && attachment?.url) {
        return (
            <TouchableOpacity
                onPress={() => onImagePress(attachment.url)}
                className="w-full"
                activeOpacity={0.9}
            >
                <Image
                    source={{uri: attachment.url}}
                    className="rounded-lg"
                    style={{
                        width: mediaDimensions.width,
                        height: mediaDimensions.height,
                        alignSelf: 'center'
                    }}
                    resizeMode="cover"
                    onError={(error) => {
                        console.error('Error loading image:', error);
                    }}
                />
                <View className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-full flex-row items-center">
                    <Text className="text-white text-xs">{fileName}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    // Xử lý hiển thị video
    if (isVideo && attachment?.url) {
        return (
            <View className="w-full">
                <TouchableOpacity
                    onPress={handleVideoPress}
                    activeOpacity={0.9}
                    className="relative"
                >
                    <Video
                        ref={videoRef}
                        source={{uri: attachment.url}}
                        style={{
                            width: mediaDimensions.width,
                            height: mediaDimensions.height,
                            alignSelf: 'center',
                            borderRadius: 8
                        }}
                        useNativeControls={false}
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={onVideoStatusUpdate}
                        shouldPlay={false}
                        isLooping
                    />

                    {/* Overlay hiển thị nút play/pause */}
                    <View
                        className="absolute inset-0 items-center justify-center"
                        style={{backgroundColor: isPlaying ? 'transparent' : 'rgba(0,0,0,0.3)'}}
                    >
                        {!isPlaying && (
                            <View className="bg-white/30 rounded-full p-3">
                                <Ionicons name="play" size={24} color="white"/>
                            </View>
                        )}
                    </View>

                    {/* Hiển thị tên file */}
                    <View
                        className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded-full flex-row items-center">
                        <Ionicons name="videocam" size={12} color="white"/>
                        <Text className="text-white text-xs ml-1">{fileName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    // Xử lý hiển thị các loại file khác
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
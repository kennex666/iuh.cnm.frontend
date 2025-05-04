// src/components/chat/input/ChatInputArea.tsx
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from "@expo/vector-icons";
import EmojiPicker from "../EmojiPicker";
import StickerPicker from "../StickerPicker";
import {Shadows} from "@/src/styles/Shadow";

interface ChatInputAreaProps {
    onSendMessage: () => void;
    message: string;
    onChangeMessage: (text: string) => void;
    onReplyCancel?: () => void;
    onSelectFile: () => void;
    onToggleVoteModal: () => void;
    openFileSelection: () => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = (
    {
        onSendMessage,
        message,
        onChangeMessage,
        onSelectFile,
        onToggleVoteModal,
        openFileSelection
    }) => {
    const [inputHeight, setInputHeight] = useState(28);
    const [isModelEmoji, setIsModelEmoji] = useState(false);
    const [isModelSticker, setIsModelSticker] = useState(false);

    const toggleModelEmoji = () => {
        setIsModelEmoji(!isModelEmoji);
    };

    const toggleModelSticker = () => {
        setIsModelSticker(!isModelSticker);
    };

    // Create adapter functions that match the expected types
    const handleEmojiChange = (value: string | ((prevState: string) => string)) => {
        if (typeof value === 'function') {
            // If it's a function that takes previous state
            onChangeMessage(value(message));
        } else {
            // If it's a direct value
            onChangeMessage(value);
        }
    };

    return (
        <View className="border-t border-gray-200 p-4">
            <View className="flex-row items-center position-relative">
                <TouchableOpacity className="p-2" onPress={openFileSelection}>
                    <Ionicons name="add-circle-outline" size={24} color="#666"/>
                </TouchableOpacity>

                <View className="relative">
                    <TouchableOpacity className="p-2" onPress={toggleModelSticker}>
                        <Ionicons name="gift-outline" size={24} color="#666"/>
                    </TouchableOpacity>
                    {isModelSticker && (
                        <View
                            className="absolute bottom-full bg-white z-50 left-0 rounded-lg overflow-hidden border border-gray-200"
                            style={Shadows.xl}
                        >
                            <StickerPicker
                                setMessage={handleEmojiChange}
                                toggleModelSticker={toggleModelSticker}
                            />
                        </View>
                    )}
                </View>

                <View className="relative">
                    <TouchableOpacity className="p-2" onPress={onToggleVoteModal}>
                        <Ionicons name="bar-chart-outline" size={24} color="#666"/>
                    </TouchableOpacity>
                </View>

                <View className="flex-1 bg-gray-100 rounded-full mx-2 px-4 py-2">
                    <TextInput
                        className="min-h-[26px] text-base text-gray-800"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChangeText={onChangeMessage}
                        multiline
                        numberOfLines={1}
                        placeholderTextColor="#666"
                        style={{
                            borderWidth: 0,
                            outline: "none",
                            height: Math.min(inputHeight, 26 * 3),
                        }}
                        onContentSizeChange={(event) => {
                            const {height} = event.nativeEvent.contentSize;
                            setInputHeight(height > 26 ? height : 26);
                        }}
                        onBlur={() => {
                            if (inputHeight < 28) {
                                setInputHeight(28);
                            }
                        }}
                        onFocus={() => {
                            setInputHeight(28);
                        }}
                    />
                </View>

                <View className="relative">
                    <TouchableOpacity className="p-2" onPress={toggleModelEmoji}>
                        <Ionicons name="happy-outline" size={24} color="#666"/>
                    </TouchableOpacity>
                    {isModelEmoji && (
                        <View
                            className="absolute bottom-full bg-white z-50 right-0 w-[300px] rounded-lg overflow-hidden border border-gray-200"
                            style={Shadows.xl}
                        >
                            <EmojiPicker
                                setMessage={handleEmojiChange}
                                toggleModelEmoji={toggleModelEmoji}
                            />
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    className={`p-3 rounded-full ${
                        message.trim() ? "bg-blue-500" : "bg-gray-200"
                    }`}
                    onPress={onSendMessage}
                    disabled={!message.trim()}
                    style={[
                        message.trim() && Shadows.md,
                        {
                            transform: [{scale: message.trim() ? 1 : 0.95}],
                        },
                    ]}
                >
                    <Ionicons
                        name="send"
                        size={20}
                        color={message.trim() ? "#FFF" : "#999"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChatInputArea;
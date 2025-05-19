import React, {useState} from "react";
import {Platform, Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import QRCodeDisplay from "../ui/QRCodeDisplay";
import {Conversation} from "@/src/models/Conversation";

interface HeaderInfoProps {
    isGroup: boolean;
    onBackPress?: () => void;
    selectedChat: Conversation | null;
}

export default function HeaderInfo({
                                       isGroup,
                                       onBackPress,
                                       selectedChat,
                                   }: HeaderInfoProps) {
    const [showQRCode, setShowQRCode] = React.useState(true);
    const [qrValue, setQrValue] = useState("https://ngthluan.io.vn/");
    return (
        <View className="h-16 px-6 border-b border-blue-100 flex-row items-center justify-between bg-white">
            <View className="flex-row justify-between items-center w-full">
                <View className="flex-row items-center">
                    {onBackPress && (
                        <TouchableOpacity
                            onPress={onBackPress}
                            className="mr-4 w-9 h-9 bg-blue-50 rounded-full items-center justify-center active:bg-blue-100"
                        >
                            <Ionicons name="chevron-back" size={24} color="#3B82F6"/>
                        </TouchableOpacity>
                    )}
                    <Text className="text-[17px] font-semibold text-blue-950">
                        {isGroup ? "Thông tin nhóm" : "Thông tin người dùng"}
                    </Text>
                </View>
                <View>
                    {/* QR url nhom */}
                    {Platform.OS === "web" && (
                        <TouchableOpacity
                            onPress={() => setShowQRCode(!showQRCode)}
                            className="w-9 h-9 bg-blue-50 rounded-full items-center justify-center active:bg-blue-100 relative"
                        >
                            <Ionicons name="qr-code-outline" size={18} color="#3B82F6"/>
                            {
                                showQRCode && (
                                    <View className="absolute top-12 right-0 z-10 bg-white shadow-lg rounded-lg p-2">
                                        <QRCodeDisplay
                                            value={selectedChat?.url || qrValue}
                                            size={256}
                                        />
                                    </View>
                                )
                            }
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface ModalHeaderProps {
    title: string;
    leftText?: string;
    rightText?: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
}

const ModalHeader = ({
                         title,
                         leftText,
                         rightText,
                         onLeftPress = () => {
                         },
                         onRightPress = () => {
                         },
                     }: ModalHeaderProps) => (
    <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onLeftPress} className="p-2">
                {leftText ? <Text className="text-gray-600">{leftText}</Text> :
                    <Ionicons name="close" size={24} color="black"/>}
            </TouchableOpacity>
            <Text className="text-black text-lg font-medium">{title}</Text>
            {rightText ? (
                <TouchableOpacity onPress={onRightPress} className="p-2">
                    <Text className="text-blue-500 font-medium">{rightText}</Text>
                </TouchableOpacity>
            ) : <View className="w-8"/>}
        </View>
    </View>
);

export default ModalHeader;

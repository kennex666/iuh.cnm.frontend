import {Text, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

type GLYPHS = keyof typeof Ionicons.glyphMap;

interface ModalHeaderProps {
    title: string;
    leftText?: string;
    rightText?: string;
    onLeftPress?: () => void;
    onRightPress?: () => void;
    leftIconName?: GLYPHS;
    rightIconName?: GLYPHS;
}

const ModalHeader = ({
                         title,
                         leftText,
                         rightText,
                         onLeftPress,
                         onRightPress,
                         leftIconName,
                         rightIconName,
                     }: ModalHeaderProps) => (
    <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center">
            <View style={{flex: 2, flexDirection: "row", alignItems: "center"}}>
                {onLeftPress ? (
                    <TouchableOpacity onPress={onLeftPress} className="p-2 flex-row items-center">
                        {leftIconName && <Ionicons name={leftIconName} size={24} color="black"/>}
                        {leftText && <Text className="text-gray-600 ml-2">{leftText}</Text>}
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center">
                        {leftIconName && <Ionicons name={leftIconName} size={24} color="black"/>}
                        {leftText && <Text className="text-gray-600 ml-2">{leftText}</Text>}
                    </View>
                )}
            </View>

            <View style={{flex: 6, alignItems: "center"}}>
                <Text className="text-black text-lg font-medium">{title}</Text>
            </View>

            <View style={{flex: 2, flexDirection: "row", justifyContent: "flex-end", alignItems: "center"}}>
                {onRightPress ? (
                    <TouchableOpacity onPress={onRightPress} className="p-2 flex-row items-center">
                        {rightIconName && <Ionicons name={rightIconName} size={24} color="black"/>}
                        {rightText && <Text className="text-blue-500 ml-2">{rightText}</Text>}
                    </TouchableOpacity>
                ) : (
                    <View className="flex-row items-center">
                        {rightIconName && <Ionicons name={rightIconName} size={24} color="black"/>}
                        {rightText && <Text className="text-blue-500 ml-2">{rightText}</Text>}
                    </View>
                )}
            </View>
        </View>
    </View>
);

export default ModalHeader;

import {Image, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface AvatarImageProps {
    source: any;
    onPickImage: () => void;
}

const AvatarImage = ({source, onPickImage}: AvatarImageProps) => (
    <View className="relative -mt-20 flex items-center">
        <View className="border-4 border-white rounded-full">
            <Image
                source={source}
                className="w-32 h-32 rounded-full"
                style={{width: 128, height: 128}}
                defaultSource={require("../../assets/profile/avatar.png")}
            />
            <TouchableOpacity
                className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-2"
                onPress={onPickImage}
            >
                <Ionicons name="camera" size={20} color="#4B5563"/>
            </TouchableOpacity>
        </View>
    </View>
);

export default AvatarImage;

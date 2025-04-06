import {Image, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

interface CoverImageProps {
    source: any;
    onPickImage: () => void;
}

const CoverImage = ({source, onPickImage}: CoverImageProps) => (
    <View className="w-full h-48">
        <Image
            source={source}
            className="w-full h-full"
            style={{width: '100%', height: 192}}
            defaultSource={require("../../assets/profile/cover.png")}
        />
        <TouchableOpacity
            className="absolute bottom-2 right-2 bg-gray-100 rounded-full p-2"
            onPress={onPickImage}
        >
            <Ionicons name="camera" size={20} color="#4B5563"/>
        </TouchableOpacity>
    </View>
);

export default CoverImage;

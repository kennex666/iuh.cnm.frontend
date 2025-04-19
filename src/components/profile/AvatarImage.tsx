import {Image, ImageSourcePropType, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {ImageConstants} from "@/src/constants/ImageConstant";
import {useUser} from "@/src/contexts/user/UserContext";

interface AvatarImageProps {
    onPickImage: () => void;
    customSource?: ImageSourcePropType;
}

const AvatarImage = ({onPickImage, customSource}: AvatarImageProps) => {
    const {profile} = useUser();

    // Use customSource if provided, otherwise use profile.avatarURL
    const source = customSource ||
        (profile?.avatarURL ? {uri: profile.avatarURL} : ImageConstants.profile.avatar);

    return (
        <View className="relative -mt-20 flex items-center">
            <View className="border-4 border-white rounded-full">
                <Image
                    source={source}
                    className="w-32 h-32 rounded-full"
                    style={{width: 128, height: 128}}
                    defaultSource={ImageConstants.profile.avatar}
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
};

export default AvatarImage;
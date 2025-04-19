import {Image, ImageSourcePropType, TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {ImageConstants} from "@/src/constants/ImageConstant";
import {useUser} from "@/src/contexts/user/UserContext";

interface CoverImageProps {
    onPickImage: () => void;
    customSource?: ImageSourcePropType;
}

const CoverImage = ({onPickImage, customSource}: CoverImageProps) => {
    const {profile} = useUser();

    // Use customSource if provided, otherwise use profile.coverURL
    const source = customSource ||
        (profile?.coverURL ? {uri: profile.coverURL} : ImageConstants.profile.cover);

    return (
        <View className="w-full h-48">
            <Image
                source={source}
                className="w-full h-full"
                style={{width: '100%', height: 192}}
                defaultSource={ImageConstants.profile.cover}
            />
            <TouchableOpacity
                className="absolute bottom-2 right-2 bg-gray-100 rounded-full p-2"
                onPress={onPickImage}
            >
                <Ionicons name="camera" size={20} color="#4B5563"/>
            </TouchableOpacity>
        </View>
    );
};

export default CoverImage;
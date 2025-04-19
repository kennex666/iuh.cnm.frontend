import {ImageSourcePropType} from "react-native";
import axios from "axios";

type URI = string | null | undefined;

const validateImageURL = async (uri: URI, fallbackImage: any): Promise<ImageSourcePropType> => {
    try {
        if (!uri || !uri.startsWith("http")) return fallbackImage;

        const response = await axios.head(uri);
        if (response.status === 200) return {uri};
        else return fallbackImage;
    } catch (error) {
        if (__DEV__) console.warn("Failed to validate image URL:", uri);
        return fallbackImage;
    }
};

const validateAvatar = async (uri: string | null | undefined): Promise<ImageSourcePropType> => {
    return validateImageURL(uri, require("@/resources/assets/profile/avatar.png"));
};

const validateCover = async (uri: string | null | undefined): Promise<ImageSourcePropType> => {
    return validateImageURL(uri, require("@/resources/assets/profile/cover.png"));
};

const validateGroupAvatar = async (uri: string | null | undefined): Promise<ImageSourcePropType> => {
    return validateImageURL(uri, require("@/resources/assets/profile/cover.png"));
};

export {validateAvatar, validateCover, validateGroupAvatar};

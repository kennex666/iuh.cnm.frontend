import {ImageSourcePropType} from "react-native";
import axios from "axios";

type ImageURL = string | null | undefined;

const validateImageURL = async (url: ImageURL, fallbackImage: any): Promise<ImageSourcePropType> => {
    try {
        if (!url || !url.startsWith("http")) return fallbackImage;

        const response = await axios.head(url);
        if (response.status === 200) return {uri: url};
        else return fallbackImage;
    } catch (error) {
        if (__DEV__) console.warn("Failed to validate image URL:", url, error);
        return fallbackImage;
    }
};

const validateAvatar = async (url: string | null | undefined): Promise<ImageSourcePropType> => {
    return validateImageURL(url, require("@/resources/assets/profile/avatar.png"));
};

const validateCover = async (url: string | null | undefined): Promise<ImageSourcePropType> => {
    return validateImageURL(url, require("@/resources/assets/profile/cover.png"));
};

const validateGroupAvatar = async (url: string | null | undefined): Promise<ImageSourcePropType> => {
    return validateImageURL(url, require("@/resources/assets/profile/cover.png"));
};

export {validateAvatar, validateCover, validateGroupAvatar};

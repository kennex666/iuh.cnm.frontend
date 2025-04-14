import axios from "axios";
import {ImageSourcePropType} from "react-native";

const validateAvatar = async (uri: string): Promise<ImageSourcePropType> => {
    try {
        if (!uri.startsWith("http")) {
            return require("@/resources/assets/profile/avatar.png");
        }
        const response = await axios.head(uri);
        if (response.status === 200) {
            return {uri};
        } else {
            return require("@/resources/assets/profile/avatar.png");
        }
    } catch (error) {
        console.error("Error validating image URL:", error);
        return require("@/resources/assets/profile/avatar.png");
    }
};

const validateCover = async (uri: string): Promise<ImageSourcePropType> => {
    try {
        if (!uri.startsWith("http")) {
            return require("@/resources/assets/profile/cover.png");
        }
        const response = await axios.head(uri);
        if (response.status === 200) {
            return {uri};
        } else {
            return require("@/resources/assets/profile/cover.png");
        }
    } catch (error) {
        console.error("Error validating image URL:", error);
        return require("@/resources/assets/profile/cover.png");
    }
}

export {validateAvatar, validateCover};

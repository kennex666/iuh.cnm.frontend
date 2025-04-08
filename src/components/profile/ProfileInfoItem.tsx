import {Text, View} from "react-native";

interface ProfileInfoItemProps {
    label: string;
    value: string | number;
}

const ProfileInfoItem = ({label, value}: ProfileInfoItemProps) => (
    <View
        className="mb-4 flex-row justify-between border-b border-gray-100 pb-3">
        <Text className="text-gray-600">{label}</Text>
        <Text className="text-black font-medium">{value}</Text>
    </View>
);

export default ProfileInfoItem;

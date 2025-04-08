import {Text, TouchableOpacity, View} from "react-native";

interface RadioButtonProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const RadioButton = ({label, selected, onPress}: RadioButtonProps) => (
    <TouchableOpacity
        className={`flex-row items-center mr-4 ${selected ? 'opacity-100' : 'opacity-50'}`}
        onPress={onPress}
    >
        <View
            className={`w-5 h-5 rounded-full border ${selected ? 'border-blue-500' : 'border-gray-400'} mr-1 items-center justify-center`}
        >
            {selected && <View className="w-3 h-3 rounded-full bg-blue-500"/>}
        </View>
        <Text>{label}</Text>
    </TouchableOpacity>
);

export default RadioButton;

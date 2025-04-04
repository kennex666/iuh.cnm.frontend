import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 justify-center items-center">
            <Button title="Go to About" onPress={() => router.push("/about")} />
        </View>
    );
}

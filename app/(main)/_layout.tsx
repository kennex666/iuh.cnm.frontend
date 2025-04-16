import {Href, Link, Redirect, Stack, usePathname, useRouter} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import {Dimensions, Image, ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useEffect, useState} from "react";
import ProfileModal from "@/app/(main)/profileUser";
import {useAuth} from "@/src/contexts/UserContext";
import {validateAvatar} from "@/src/utils/ImageValidator";

type Route = {
    name: string;
    title: string;
    icon: "comments" | "address-book" | "gear" | "user";
};

const routes: Route[] = [
    {name: "index", title: "Tin nhắn", icon: "comments"},
    {name: "contacts", title: "Danh bạ", icon: "address-book"},
    {name: "settings", title: "Cài đặt", icon: "gear"},
];

export default function AppLayout() {
    const {user, isLoading, logout} = useAuth();
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [avatar, setAvatar] = useState<ImageSourcePropType>({uri: ""});
    const router = useRouter();
    const {width} = Dimensions.get("window");
    const isDesktop = width > 768;
    const insets = useSafeAreaInsets();
    const pathname = usePathname();

    // Check if the current route is active
    const isActive = (routeName: string) => {
        if (routeName === "index") {
            return pathname === "/" || pathname === "/index";
        }
        return pathname === `/${routeName}`;
    };

    // Get the href for the route
    const getHref = (routeName: string) => {
        if (routeName === "index") return "/";
        return `/(main)/${routeName}` as Href;
    };

    useEffect(() => {
        validateAvatar(user?.avatarURL || "").then((validatedAvatar) => {
            setAvatar(validatedAvatar);
        });
    }, [user?.avatarURL]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-base text-blue-500">Đang tải...</Text>
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/"/>;
    }

    return (
        <View className="flex-1 flex-row bg-white">
            {isDesktop && (
                <View
                    className="w-16 bg-white items-center border-r border-gray-200"
                    style={{paddingTop: insets.top + 16}}
                >
                    <View className="flex-1 flex-col items-center justify-between">
                        <View>
                            <TouchableOpacity
                                className="relative mb-4"
                                onPress={() => {
                                    setProfileModalVisible(true)
                                    console.log("Profile modal visible", avatar)
                                }}
                            >
                                <Image
                                    source={avatar}
                                    resizeMode="cover"
                                    className="w-10 h-10 rounded-full"
                                    style={{width: 40, height: 40}}
                                />
                                <View className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"/>
                            </TouchableOpacity>

                            <View className="w-4/5 h-px bg-gray-200 mb-4"/>

                            {routes.map((route) => {
                                const active = isActive(route.name);
                                return (
                                    <Link
                                        key={route.name}
                                        href={getHref(route.name)}
                                        className={`w-12 h-12 justify-center items-center mb-2 rounded-xl ${
                                            active ? "bg-blue-50" : ""
                                        }`}
                                    >
                                        <View className="w-full h-full justify-center items-center">
                                            <FontAwesome
                                                name={route.icon}
                                                size={24}
                                                color={active ? "#0068FF" : "#666"}
                                            />
                                        </View>
                                    </Link>
                                );
                            })}
                        </View>
                        <View className="flex flex-col items-center justify-center py-4 relative">
                            <TouchableOpacity
                                className="p-2 rounded-lg"
                                onPress={async () => {
                                    try {
                                        await logout();
                                        router.replace('/(auth)');
                                    } catch (error) {
                                        console.error('Error during logout:', error);
                                    }
                                }}
                            >
                                <FontAwesome name="sign-out" size={24} color="#FF0000"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            <View className="flex-1">
                <Stack screenOptions={{headerShown: false}}/>
            </View>

            {!isDesktop && (
                <View
                    className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-gray-200"
                    style={{
                        paddingBottom: insets.bottom,
                        height: 54 + insets.bottom,
                        zIndex: 100,
                        elevation: 8,
                    }}
                >
                    {routes.map((route) => {
                        const active = isActive(route.name);
                        return (
                            <Link
                                key={route.name}
                                href={getHref(route.name)}
                                className="flex-1 h-full justify-center items-center"
                                asChild
                            >
                                <TouchableOpacity>
                                    <View className="items-center">
                                        <FontAwesome
                                            name={route.icon}
                                            size={24}
                                            color={active ? "#0068FF" : "#666"}
                                        />
                                        <Text
                                            className={`text-xs mt-1 ${
                                                active ? "text-blue-500" : "text-gray-500"
                                            }`}
                                        >
                                            {route.title}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        );
                    })}
                    <TouchableOpacity
                        className="flex-1 h-full justify-center items-center"
                        onPress={() => setProfileModalVisible(true)}
                    >
                        <View className="items-center">
                            <Image
                                source={avatar}
                                resizeMode="cover"
                                className="w-10 h-10 rounded-full"
                                style={{width: 24, height: 24}}
                            />
                            <Text className="text-xs mt-1 text-gray-500">Tài khoản</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            <ProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
            />
        </View>
    );
}

import {Href, Link, Redirect, Stack, usePathname} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import {Alert, Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useState} from "react";
import ProfileModal from "@/app/(main)/profileUser";
import {useAuth} from "@/src/contexts/userContext";

type Route = {
    name: string;
    title: string;
    icon: "comments" | "address-book" | "clock-o" | "user";
};

export default function AppLayout() {
    const {user, isLoading, logout} = useAuth();
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    const {width} = Dimensions.get("window");
    const isDesktop = width > 768;
    const insets = useSafeAreaInsets();
    const pathname = usePathname();

    const handleLogout = () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    onPress: async () => {
                        try {
                            await logout();
                            // After logout, user will be redirected to login screen
                            // The useEffect with user dependency will handle this
                        } catch (error) {
                            console.error("Logout error:", error);
                            Alert.alert("Lỗi", "Đã có lỗi xảy ra khi đăng xuất.");
                        }
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    if (!isLoading && !user) {
        return <Redirect href="/"/>;
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-base text-blue-500">Đang tải...</Text>
            </View>
        );
    }

    const routes: Route[] = [
        {name: "index", title: "Tin nhắn", icon: "comments"},
        {name: "contacts", title: "Danh bạ", icon: "address-book"},
        {name: "diary", title: "Nhật ký", icon: "clock-o"},
    ];

    // Check if the current route is active
    // This is used to highlight the active tab in the sidebar and bottom tabs
    const isActive = (routeName: string) => {
        if (routeName === "index") {
            return pathname === "/" || pathname === "/index";
        }
        return pathname === `/${routeName}`;
    };

    // Get the href for the route
    // This is used to navigate to the route when the tab is pressed
    const getHref = (routeName: string) => {
        if (routeName === "index") return "/";
        return `/(main)/${routeName}` as Href;
    };

    return (
        <View className="flex-1 flex-row bg-white">
            {isDesktop ? (
                <View
                    className={`w-16 bg-white items-center border-r border-gray-200`}
                    style={{paddingTop: insets.top + 16}}
                >
                    <View className="flex-1 flex-col items-center justify-between">
                        {/* Header of Tabs */}
                        <View>
                            {/* Avatar */}
                            <TouchableOpacity
                                className="relative mb-4"
                                onPress={() => setProfileModalVisible(true)}
                            >
                                <Image
                                    source={{
                                        uri:
                                            user?.avatarURL ||
                                            `https://placehold.co/200x200/0068FF/FFFFFF/png?text=${
                                                user?.name?.charAt(0) || "U"
                                            }`,
                                    }}
                                    className="w-10 h-10 rounded-full"
                                />
                                <View
                                    className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"/>
                            </TouchableOpacity>

                            {/* Divider */}
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
                        {/* Bottoms: logout, exit */}
                        <View className="flex flex-col items-center justify-center py-4 relative">
                            <TouchableOpacity
                                className="p-2 rounded-lg"
                                onPress={handleLogout}
                            >
                                <FontAwesome name="sign-out" size={24} color="#FF0000"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : null}

            <View className="flex-1">
                <Stack screenOptions={{headerShown: false}}/>
            </View>

            {!isDesktop ? (
                <View
                    className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-gray-200"
                    style={{
                        paddingBottom: insets.bottom,
                        height: 54 + insets.bottom,
                        zIndex: 100, // Đảm bảo tabs luôn hiển thị trên cùng
                        elevation: 8, // Thêm shadow cho Android
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
                    {/* User Profile Icon */}
                    <TouchableOpacity
                        className="flex-1 h-full justify-center items-center"
                        onPress={() => setProfileModalVisible(true)}
                    >
                        <View className="items-center">
                            <View className="relative">
                                <Image
                                    source={{
                                        uri:
                                            user?.avatarURL ||
                                            `https://placehold.co/200x200/0068FF/FFFFFF/png?text=${
                                                user?.name?.charAt(0) || "U"
                                            }`,
                                    }}
                                    className="w-6 h-6 rounded-full"
                                />
                                <View
                                    className="absolute -right-0.5 -bottom-0.5 w-2 h-2 rounded-full bg-green-500 border border-white"/>
                            </View>
                            <Text className="text-xs mt-1 text-gray-500">Cá nhân</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : null}
            <ProfileModal
                visible={profileModalVisible}
                onClose={() => setProfileModalVisible(false)}
            />
        </View>
    );
}

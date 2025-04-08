import {Href, Link, Redirect, Stack, usePathname} from "expo-router";
import {FontAwesome} from "@expo/vector-icons";
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
    const {user, isLoading} = useAuth();
    const [profileModalVisible, setProfileModalVisible] = useState(false);

    const {width} = Dimensions.get("window");
    const isDesktop = width > 768;
    const insets = useSafeAreaInsets();
    const pathname = usePathname();

    if (!isLoading && !user) {
        return <Redirect href="/"/>;
    }

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Đang tải...</Text>
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
        <View style={styles.container}>
            {isDesktop ? (
                <View style={[styles.leftSidebar, {paddingTop: insets.top + 16}]}>
                    <View className='flex-1 flex-col items-center justify-between'>
                        {/* Header of Tabs */}
                        <View>
                            {/* Avatar */}
                            <TouchableOpacity style={styles.avatarContainer}
                                              onPress={() => setProfileModalVisible(true)}>
                                <Image
                                    source={{
                                        uri:
                                            user?.avatarURL ||
                                            `https://placehold.co/200x200/0068FF/FFFFFF/png?text=${user?.name?.charAt(0) || "U"}`,
                                    }}
                                    style={styles.avatar}
                                />
                                <View style={styles.onlineIndicator}/>
                            </TouchableOpacity>

                            {/* Divider */}
                            <View style={styles.divider}/>

                            {routes.map((route) => {
                                const active = isActive(route.name);
                                return (
                                    <Link
                                        key={route.name}
                                        href={getHref(route.name)}
                                        style={[styles.tabItem, active && styles.activeTabItem]}
                                    >
                                        <View style={styles.iconContainer}>
                                            <FontAwesome name={route.icon} size={24}
                                                         color={active ? "#0068FF" : "#666"}/>
                                        </View>
                                    </Link>
                                );
                            })}
                        </View>
                        {/* Bottoms: logout, exit */}
                        <View className='flex flex-col items-center justify-center py-4 relative'>
                            <TouchableOpacity className='p-2 rounded-lg'>
                                <FontAwesome name="sign-out" size={24} color="#FF0000"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : null}

            <View style={styles.content}>
                <Stack screenOptions={{headerShown: false}}/>
            </View>

            {!isDesktop ? (
                <View style={[styles.bottomTabs, {paddingBottom: insets.bottom, height: 52 + insets.bottom}]}>
                    {routes.map((route) => {
                        const active = isActive(route.name);
                        return (
                            <Link key={route.name} href={getHref(route.name)} style={styles.bottomTabItem}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome name={route.icon} size={24} color={active ? "#0068FF" : "#666"}/>
                                </View>
                                <Text
                                    style={[styles.bottomTabText, active && styles.activeBottomTabText]}>{route.title}</Text>
                            </Link>
                        );
                    })}
                </View>
            ) : null}
            <ProfileModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#fff",
    },
    leftSidebar: {
        width: 64,
        backgroundColor: "#fff",
        alignItems: "center",
        borderRightWidth: 1,
        borderRightColor: "#E5E7EB",
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    onlineIndicator: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#22C55E",
        borderWidth: 2,
        borderColor: "#fff",
    },
    divider: {
        width: "80%",
        height: 1,
        backgroundColor: "#E5E7EB",
        marginBottom: 16,
    },
    tabItem: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
        borderRadius: 12,
    },
    activeTabItem: {
        backgroundColor: "#EBF5FF",
    },
    iconContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
    },
    bottomTabs: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 6,
    },
    bottomTabItem: {
        flex: 1,
        height: 46,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomTabText: {
        fontSize: 12,
        marginTop: 4,
        color: "#666",
    },
    activeBottomTabText: {
        color: "#0068FF",
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "#0068FF",
    },
});
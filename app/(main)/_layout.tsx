import {
  Href,
  Link,
  Redirect,
  Stack,
  usePathname,
  useRouter,
} from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import ProfileModal from "@/app/(main)/profileUser";
import { validateAvatar } from "@/src/utils/ImageValidator";
import { useUser } from "@/src/contexts/user/UserContext";
import { TabBarProvider, useTabBar } from "@/src/contexts/tabbar/TabBarContext";

type Route = {
  name: string;
  title: string;
  icon: "comments" | "address-book" | "gear" | "user";
};

const routes: Route[] = [
  { name: "index", title: "Tin nhắn", icon: "comments" },
  { name: "contacts", title: "Danh bạ", icon: "address-book" },
  { name: "settings", title: "Cài đặt", icon: "gear" },
];

export default function AppLayout() {
  const { user, isLoading, logout } = useUser();
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [avatar, setAvatar] = useState<ImageSourcePropType>({ uri: "" });
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const isDesktop = width > 768;
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { isVisible: isTabBarVisible } = useTabBar();

  // Check if the current route is active
  const isActive = (routeName: string) => {
    if (routeName === "index") {
      return pathname === "/" || pathname === "/index";
    }
    return pathname === `/${routeName}`;
  };

  // Get the href for the route
  const getHref = (routeName: string) => {
    console.log("routeName", routeName);
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
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 flex-row">
      {isDesktop && (
        <View
          className="w-16 bg-gradient-to-b from-blue-50 to-white items-center border-r border-blue-100"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-1 flex-col items-center justify-between">
            <View>
              <TouchableOpacity
                className="relative mb-6"
                onPress={() => {
                  setProfileModalVisible(true);
                }}
              >
                <Image
                  source={avatar}
                  resizeMode="cover"
                  className="w-10 h-10 rounded-full border-2 border-blue-100"
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>

              <View className="w-4/5 h-px bg-blue-100 mb-6" />

              {routes.map((route) => {
                const active = isActive(route.name);
                return (
                  <Link
                    key={route.name}
                    href={getHref(route.name)}
                    className={`w-12 h-12 justify-center items-center mb-3 rounded-xl transition-all duration-200 ${
                      active ? "bg-blue-500 shadow-sm" : "hover:bg-blue-50"
                    }`}
                  >
                    <View className="w-full h-full justify-center items-center">
                      <FontAwesome
                        name={route.icon}
                        size={20}
                        color={active ? "#FFFFFF" : "#3B82F6"}
                      />
                    </View>
                  </Link>
                );
              })}
            </View>
            <View className="flex flex-col items-center justify-center py-4 relative">
              <TouchableOpacity
                className="p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
                onPress={async () => {
                  try {
                    await logout();
                    router.replace("/(auth)");
                  } catch (error) {
                    console.error("Error during logout:", error);
                  }
                }}
              >
                <FontAwesome name="sign-out" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {!isDesktop && (
        <View className="flex-1 mt-12">
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      )}

      {isDesktop && (
        <View className="flex-1 mx-4 my-4">
          <View className="flex-1 bg-white">
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: "transparent",
                },
              }}
            />
          </View>
        </View>
      )}

      {!isDesktop && isTabBarVisible && (
        <View
          className="absolute bottom-0 left-0 right-0 flex-row bg-white border-t border-blue-100"
          style={{
            paddingBottom: insets.bottom,
            height: 60 + insets.bottom,
            zIndex: 100,
            elevation: 8,
          }}
        >
          {routes.map((route) => {
            const active = isActive(route.name);
            return (
              <TouchableOpacity
                key={route.name}
                onPress={() => {
                  router.replace(getHref(route.name));
                }}
				className={`flex-1 h-full justify-center items-center`}
              >
                <View className="items-center">
                  <View
                    className={`p-2 rounded-lg ${active ? "bg-blue-50" : ""}`}
                  >
                    <FontAwesome
                      name={route.icon}
                      size={22}
                      color={active ? "#3B82F6" : "#6B7280"}
                    />
                  </View>
                  <Text
                    className={`text-xs mt-1 font-medium ${
                      active ? "text-blue-500" : "text-gray-500"
                    }`}
                  >
                    {route.title}
                  </Text>
                </View>
              </TouchableOpacity>
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
                className="w-8 h-8 rounded-full border-2 border-blue-100"
                style={{ width: 32, height: 32 }}
              />
              <Text className="text-xs mt-1 font-medium text-gray-500">
                Tài khoản
              </Text>
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

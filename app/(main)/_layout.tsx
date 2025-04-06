import { Stack, Link, usePathname } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions, StyleSheet, View, Text, Image, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Route = {
  name: string;
  title: string;
  icon: 'comments' | 'address-book' | 'clock-o' | 'user';
};

export default function AppLayout() {
  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const routes: Route[] = [
    { name: 'index', title: 'Tin nhắn', icon: 'comments' },
    { name: 'contacts', title: 'Danh bạ', icon: 'address-book' },
    { name: 'diary', title: 'Nhật ký', icon: 'clock-o' },
    { name: 'profile', title: 'Cá nhân', icon: 'user' },
  ];

  // Check if the current route is active
  // This is used to highlight the active tab in the sidebar and bottom tabs
  const isActive = (routeName: string) => {
    if (routeName === 'index') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname === `/${routeName}`;
  };

  // Get the href for the route
  // This is used to navigate to the route when the tab is pressed
  const getHref = (routeName: string) => {
    if (routeName === 'index') return '/';
    return `/(main)/${routeName}` as const;
  };

  return (
    <View style={styles.container}>
      {isDesktop ? (
        <View style={[styles.leftSidebar, { paddingTop: insets.top + 16 }]}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://placehold.co/200x200/0068FF/FFFFFF/png?text=A' }}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {routes.map((route) => {
            const active = isActive(route.name);
            return (
              <Link
                key={route.name}
                href={getHref(route.name)}
                style={[styles.tabItem, active && styles.activeTabItem]}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome 
                    name={route.icon}
                    size={24} 
                    color={active ? '#0068FF' : '#666'} 
                  />
                </View>
              </Link>
            );
          })}
        </View>
      ) : null}

      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {!isDesktop ? (
        <View style={[
          styles.bottomTabs,
          { paddingBottom: insets.bottom, height: 52 + insets.bottom }
        ]}>
          {routes.map((route) => {
            const active = isActive(route.name);
            return (
              <Link
                key={route.name}
                href={getHref(route.name)}
                style={styles.bottomTabItem}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome 
                    name={route.icon}
                    size={24} 
                    color={active ? '#0068FF' : '#666'} 
                  />
                </View>
                <Text style={[
                  styles.bottomTabText,
                  active && styles.activeBottomTabText
                ]}>
                  {route.title}
                </Text>
              </Link>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  leftSidebar: {
    width: 64,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 16,
  },
  tabItem: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 12,
  },
  activeTabItem: {
    backgroundColor: '#EBF5FF',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 6,
  },
  bottomTabItem: {
    flex: 1,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeBottomTabText: {
    color: '#0068FF',
  },
}); 
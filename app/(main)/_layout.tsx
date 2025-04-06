import { Stack, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppLayout() {
  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;
  const insets = useSafeAreaInsets();

  const routes = [
    { name: 'index', title: 'Tin nhắn', icon: 'comments' },
    { name: 'contacts', title: 'Danh bạ', icon: 'address-book' },
    { name: 'diary', title: 'Nhật ký', icon: 'clock-o' },
    { name: 'profile', title: 'Cá nhân', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      {isDesktop ? (
        <View style={[styles.leftSidebar, { paddingTop: insets.top }]}>
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.name === 'index' ? '/' : `/${route.name}`}
              style={styles.tabItem}
            >
              <FontAwesome name={route.icon} size={20} color="#3390EC" />
            </Link>
          ))}
        </View>
      ) : null}

      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>

      {!isDesktop ? (
        <View style={styles.bottomTabs}>
          {routes.map((route) => (
            <Link
              key={route.name}
              href={route.name === 'index' ? '/' : `/${route.name}`}
              style={styles.bottomTabItem}
            >
              <FontAwesome name={route.icon} size={24} color="#3390EC" />
            </Link>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  leftSidebar: {
    width: 50,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 20,
  },
  tabItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 55,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  bottomTabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

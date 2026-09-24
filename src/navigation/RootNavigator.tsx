import {Pressable, StyleSheet, Text, View} from 'react-native';
import {BottomTabBarProps, createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GridIcon, LibraryIcon, MoreIcon, PlayIcon} from '../components/Icons';
import {DashboardScreen} from '../screens/DashboardScreen';
import {MediaLibraryScreen} from '../screens/MediaLibraryScreen';
import {MoreScreen} from '../screens/MoreScreen';
import {MovieDetailScreen} from '../screens/MovieDetailScreen';
import {SeatMapScreen} from '../screens/SeatMapScreen';
import {ShowtimesScreen} from '../screens/ShowtimesScreen';
import {TrailerScreen} from '../screens/TrailerScreen';
import {WatchScreen} from '../screens/WatchScreen';
import {colors} from '../theme/colors';
import {RootStackParamList, TabParamList} from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const ICONS = {
  Dashboard: GridIcon,
  Watch: PlayIcon,
  MediaLibrary: LibraryIcon,
  More: MoreIcon,
};

const LABELS = {
  Dashboard: 'Dashboard',
  Watch: 'Watch',
  MediaLibrary: 'Media Library',
  More: 'More',
};

function AppTabBar({state, navigation}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, {bottom: Math.max(insets.bottom, 10)}]}>
      {state.routes.map((route, index) => {
        const active = state.index === index;
        const Icon = ICONS[route.name as keyof typeof ICONS];
        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}>
            <Icon active={active} />
            <Text style={[styles.label, active && styles.labelActive]}>
              {LABELS[route.name as keyof typeof LABELS]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Watch"
      screenOptions={{headerShown: false}}
      tabBar={props => <AppTabBar {...props} />}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Watch" component={WatchScreen} />
      <Tab.Screen name="MediaLibrary" component={MediaLibraryScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
      <Stack.Screen
        name="Trailer"
        component={TrailerScreen}
        options={{animation: 'fade', gestureEnabled: false}}
      />
      <Stack.Screen name="Showtimes" component={ShowtimesScreen} />
      <Stack.Screen name="SeatMap" component={SeatMapScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.nav,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    color: colors.navInactive,
    fontSize: 10,
  },
  labelActive: {
    color: colors.white,
  },
});

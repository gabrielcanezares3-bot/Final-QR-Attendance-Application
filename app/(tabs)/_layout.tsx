import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: 'rgba(249,247,255,0.97)',
          borderTopColor: 'rgba(109,59,255,0.10)',
          borderTopWidth: 1,
          height: 78,
          paddingTop: 8,
          paddingBottom: 10,
          elevation: 10,
          shadowColor: COLORS.shadowDeep,
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -8 },
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '900', marginTop: 2 },
        tabBarIcon: ({ color, focused }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: focused ? 'home' : 'home-outline',
            scan: focused ? 'scan' : 'scan-outline',
            history: focused ? 'time' : 'time-outline',
            profile: focused ? 'person-circle' : 'person-circle-outline',
            teacher: focused ? 'school' : 'school-outline',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} color={color} size={focused ? 23 : 21} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="teacher" options={{ title: 'Teacher' }} />
    </Tabs>
  );
}

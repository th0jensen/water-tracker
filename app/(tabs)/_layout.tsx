import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Link, Tabs} from 'expo-router';
import {Pressable} from 'react-native';

import Colors from '@/constants/Colors.ts';
import {useColorScheme} from '@/components/useColorScheme.ts';
import {useClientOnlyValue} from '@/components/useClientOnlyValue.ts';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={28} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({color}) => <TabBarIcon name="water-drop" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({pressed}) => (
                  <MaterialIcons
                    name="calendar-month"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({color}) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}

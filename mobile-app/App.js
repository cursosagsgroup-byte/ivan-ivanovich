
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getItem } from './src/utils/storage';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CourseDetailScreen from './src/screens/CourseDetailScreen';
import PlayerScreen from './src/screens/PlayerScreen';

import CustomHeader from './src/components/CustomHeader';
import CustomTabBar from './src/components/CustomTabBar';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        sceneStyle: { backgroundColor: '#0f172a' } // New property in React Navigation 7 for background
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await getItem('user_token');
      if (token) {
        setInitialRoute('MainApp');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerStyle: { backgroundColor: '#0f172a' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#0f172a' },
            headerShown: false // Default to false, enable per screen if needed or use CustomHeader
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />

          {/* Main App with Bottom Tabs */}
          <Stack.Screen name="MainApp" component={MainTabs} />

          {/* Screens independent of Tabs (Full Screen) */}
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={{
              headerShown: true,
              title: 'Contenido',
              header: ({ navigation, back }) => <CustomHeader navigation={navigation} back={back} />
            }}
          />
          <Stack.Screen
            name="Player"
            component={PlayerScreen}
            options={{
              headerShown: true,
              title: 'Reproductor',
              header: ({ navigation, back }) => <CustomHeader navigation={navigation} back={back} />
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

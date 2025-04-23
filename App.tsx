import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStack from './src/navigation/HomeStack';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="📋 今日任務">
        <Drawer.Screen name="📋 今日任務" component={HomeScreen} />
        <Drawer.Screen name="⚙️ 設定" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

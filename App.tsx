import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import EditHabitScreen from './src/screens/EditHabitScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator initialRouteName="📋 今日任務">
      <Drawer.Screen name="📋 今日任務" component={HomeScreen} />
      <Drawer.Screen name="➕ 新增習慣" component={AddHabitScreen} />
      <Drawer.Screen name="🕒 歷史紀錄" component={HistoryScreen} />
      <Drawer.Screen name="⚙️ 設定" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Drawer 作為主要畫面 */}
        <Stack.Screen
          name="Main"
          component={DrawerRoutes}
          options={{ headerShown: false }}
        />

        {/* EditHabit 是額外頁面，會從 AddHabit navigate 過來 */}
        <Stack.Screen
          name="EditHabit"
          component={EditHabitScreen}
          options={{ title: '編輯習慣' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

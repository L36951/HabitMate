import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: '📅 今日任務' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: '任務詳細' }}
      />
    </Stack.Navigator>
  );
}

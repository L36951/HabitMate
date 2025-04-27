import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function SettingsScreen() {
  const clearAllData = async () => {
    Alert.alert('⚠️ 確認清除？', '這會刪除所有任務與紀錄，無法復原！', [
      { text: '取消', style: 'cancel' },
      {
        text: '確認清除',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove([
              'habits',
              'todayRecord',
              'history',
              'lastResetDate',
            ]);
            Alert.alert('✅ 已清除所有資料');
          } catch (e) {
            Alert.alert('❌ 清除失敗', e.message);
          }
        },
      },
    ]);
  };
  const generateDummyData = async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const habits = [
        {
          id: '1',
          name: '喝水',
          resetEvery: 1,
          startDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 5
          ).toISOString(), // 5天前
        },
        {
          id: '2',
          name: '冥想',
          resetEvery: 2,
          startDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 4
          ).toISOString(), // 4天前
        },
        {
          id: '3',
          name: '運動',
          resetEvery: 3,
          startDate: new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 6
          ).toISOString(), // 6天前
        },
      ];

      await AsyncStorage.setItem('habits', JSON.stringify(habits));

      const history: Record<string, any> = {};
      let lastStreaks: Record<string, number> = {};

      // 產生過去3天的紀錄
      for (let i = 3; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        history[dateStr] = {};

        for (const h of habits) {
          const start = new Date(h.startDate);
          const diffDays = Math.floor(
            (date.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) /
              (1000 * 60 * 60 * 24)
          );

          const shouldShow = diffDays >= 0 && diffDays % h.resetEvery === 0;

          if (shouldShow) {
            const done = Math.random() < 0.7; // 有70%完成
            const previousStreak = lastStreaks[h.id] ?? 0;
            const streak = done ? previousStreak + 1 : 0;
            history[dateStr][h.id] = {
              name: h.name,
              done,
              streak,
            };
            lastStreaks[h.id] = streak;
          }
        }
      }

      // 產生今天的 todayRecord
      const todayRecord: Record<string, any> = {};
      for (const h of habits) {
        const start = new Date(h.startDate);
        const diffDays = Math.floor(
          (today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        );
        const shouldShow = diffDays >= 0 && diffDays % h.resetEvery === 0;

        if (shouldShow) {
          todayRecord[h.id] = {
            name: h.name,
            done: false,
            streak: lastStreaks[h.id] ?? 0,
          };
        }
      }

      await AsyncStorage.setItem('todayRecord', JSON.stringify(todayRecord));
      await AsyncStorage.setItem('history', JSON.stringify(history));
      await AsyncStorage.setItem('lastResetDate', todayStr);

      Alert.alert('✅ 測試資料建立完成！');
    } catch (e) {
      Alert.alert('❌ 產生失敗', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonGreen} onPress={generateDummyData}>
        <Text style={styles.buttonText}>🧪 產生假資料</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={clearAllData}>
        <Text style={styles.buttonText}>🧹 清除所有記錄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  button: {
    marginTop: 30,
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonGreen: {
    marginTop: 15,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});

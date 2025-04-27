import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [habits, setHabits] = useState<any[]>([]);

  function shouldShowHabitToday(habit: any) {
    const today = new Date();
    const start = new Date(habit.startDate);

    const diffInTime = today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

    return diffInDays % habit.resetEvery === 0;
  }
  const checkAndResetHabits = async (): Promise<Record<string, any>> => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // 2024-04-26

    const lastReset = await AsyncStorage.getItem('lastResetDate');
    if (lastReset === todayStr) {
      // 已重置過 → 直接讀 todayRecord
      const existing = await AsyncStorage.getItem('todayRecord');
      return existing ? JSON.parse(existing) : {};
    }

    const allHabitsRaw = await AsyncStorage.getItem('habits');
    const allHabits = allHabitsRaw ? JSON.parse(allHabitsRaw) : [];

    const todayRecord: Record<string, any> = {};
    const historyRaw = await AsyncStorage.getItem('history');
    const history = historyRaw ? JSON.parse(historyRaw) : {};

    allHabits.forEach((habit: any) => {
      const start = new Date(habit.startDate);
      const diff = today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      const shouldShow = diffDays % habit.resetEvery === 0;

      if (shouldShow) {
        // 抓昨天日期
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const ymd = yesterday.toISOString().split('T')[0];
        // 找上一次 reset 的日期（從 today 倒推 resetEvery 的倍數）
        const daysSinceStart = Math.floor(
          (today.setHours(0, 0, 0, 0) -
            new Date(habit.startDate).setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24)
        );
        const resetEvery = habit.resetEvery;
        const lastResetDaysAgo =
          daysSinceStart >= resetEvery
            ? (Math.floor(daysSinceStart / resetEvery) - 1) * resetEvery
            : null;

        let streak = 0;
        if (lastResetDaysAgo !== null) {
          const lastDate = new Date(today);
          lastDate.setDate(
            today.getDate() - (daysSinceStart - lastResetDaysAgo)
          );
          const lastYMD = lastDate.toISOString().split('T')[0];
          const lastRecord = history?.[lastYMD]?.[habit.id];

          streak = lastRecord?.done ? lastRecord?.streak || 0 : 0;
        }

        todayRecord[habit.id] = {
          name: habit.name,
          done: false,
          streak: streak,
        };
      }
    });

    await AsyncStorage.setItem('todayRecord', JSON.stringify(todayRecord));
    await AsyncStorage.setItem('lastResetDate', todayStr);

    return todayRecord;
  };
  const loadHabits = async () => {
    const todayRecord = await checkAndResetHabits();

    const habitsArray = Object.entries(todayRecord).map(([id, value]: any) => ({
      id,
      ...value,
    }));

    setHabits(habitsArray);
  };

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        await checkAndResetHabits(); // 👈 加這行：每天第一次打開會重置任務
        await loadHabits(); // 👈 這是你原本的函數，會載入資料
      };
      load();
    }, [])
  );

  const toggleHabit = async (id: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const toggled = !h.done;
        return {
          ...h,
          done: toggled,
          streak: toggled ? h.streak + 1 : h.streak - 1,
        };
      }
      return h;
    });

    setHabits(updated);

    // 更新 AsyncStorage 裡的 todayRecord
    const recordRaw = await AsyncStorage.getItem('todayRecord');
    const record = recordRaw ? JSON.parse(recordRaw) : {};

    if (record[id]) {
      const toggled = !record[id].done;
      record[id].done = toggled;
      record[id].streak = toggled ? (record[id].streak || 0) + 1 : 0;
      await AsyncStorage.setItem('todayRecord', JSON.stringify(record));
    }
  };

  const renderHabit = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.habit} onPress={() => toggleHabit(item.id)}>
      <Text style={[styles.habitText, item.done && styles.done]}>
        {item.done ? '✅ ' : '⬜️ '} {item.name}（🔥{item.streak}天）
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {habits.length === 0 ? (
        <Text style={styles.emptyText}>📭 尚未新增任何習慣</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderHabit}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  habit: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  habitText: { fontSize: 18 },
  done: { textDecorationLine: 'line-through', color: 'gray' },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
    color: '#999',
  },
});

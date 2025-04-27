import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [history, setHistory] = useState<{ [date: string]: any }>({});
  const [today, setToday] = useState<{ [id: string]: any }>({});

  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const historyRaw = await AsyncStorage.getItem('history');
          const todayRaw = await AsyncStorage.getItem('todayRecord');

          const historyData = historyRaw ? JSON.parse(historyRaw) : {};
          const sorted = Object.entries(historyData).sort((a, b) =>
            b[0].localeCompare(a[0])
          );

          setHistory(Object.fromEntries(sorted));
          setToday(todayRaw ? JSON.parse(todayRaw) : {});
        } catch (e) {
          console.error('讀取歷史紀錄失敗', e);
        }
      };

      loadHistory();
    }, [])
  );

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyRaw = await AsyncStorage.getItem('history');
        const todayRaw = await AsyncStorage.getItem('todayRecord');

        const historyData = historyRaw ? JSON.parse(historyRaw) : {};
        const sorted = Object.entries(historyData).sort((a, b) =>
          b[0].localeCompare(a[0])
        );

        setHistory(Object.fromEntries(sorted));
        setToday(todayRaw ? JSON.parse(todayRaw) : {});
      } catch (e) {
        console.error('讀取歷史紀錄失敗', e);
      }
    };

    loadHistory();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🕒 歷史紀錄</Text>

      {/* 📅 今日任務 */}
      <View style={styles.dayBlock}>
        <Text style={styles.date}>📅 今日任務</Text>
        {Object.keys(today).length === 0 ? (
          <Text style={styles.habit}>尚未開始任何任務</Text>
        ) : (
          Object.entries(today).map(([id, info]: any) => (
            <Text
              key={id}
              style={[styles.habit, info.done ? styles.done : styles.notDone]}
            >
              {info.done ? '✅' : '⬜️'} {info.name}（🔥 {info.streak} 天）
            </Text>
          ))
        )}
      </View>

      {/* 🗓️ 歷史紀錄 */}
      {Object.keys(history).length === 0 ? (
        <Text style={styles.empty}>📭 尚未有歷史紀錄</Text>
      ) : (
        Object.entries(history).map(([date, records]: any) => (
          <View key={date} style={styles.dayBlock}>
            <Text style={styles.date}>{date}</Text>
            {Object.entries(records).map(([id, info]: any) => (
              <Text
                key={id}
                style={[styles.habit, info.done ? styles.done : styles.notDone]}
              >
                {info.done ? '✅' : '❌'} {info.name}（🔥 {info.streak} 天）
              </Text>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  empty: {
    fontSize: 18,
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
  },
  dayBlock: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  habit: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 4,
  },
  done: {
    color: '#2e8b57',
  },
  notDone: {
    color: '#999',
  },
});

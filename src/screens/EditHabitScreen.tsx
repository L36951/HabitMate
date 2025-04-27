import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditHabitScreen({ route, navigation }: any) {
  const { habit } = route.params;

  const [habitName, setHabitName] = useState(habit.name);
  const [resetDays, setResetDays] = useState(String(habit.resetEvery));
  const [startDate, setStartDate] = useState(new Date(habit.startDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const saveEditedHabit = async () => {
    const stored = await AsyncStorage.getItem('habits');
    const habitList = stored ? JSON.parse(stored) : [];

    const updatedHabit = {
      ...habit,
      name: habitName,
      resetEvery: parseInt(resetDays),
      startDate: startDate.toISOString(),
    };

    const updatedList = habitList.map((h: any) =>
      h.id === habit.id ? updatedHabit : h
    );

    await AsyncStorage.setItem('habits', JSON.stringify(updatedList));

    // ✅ 重新計算是否今天應該出現，並更新 todayRecord
    const today = new Date();
    const start = new Date(updatedHabit.startDate);
    const diff = today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const shouldShowToday = diffDays % updatedHabit.resetEvery === 0;

    const recordRaw = await AsyncStorage.getItem('todayRecord');
    const todayRecord = recordRaw ? JSON.parse(recordRaw) : {};

    if (shouldShowToday) {
      // 保留原 done/streak，如果有的話
      const old = todayRecord[updatedHabit.id];
      todayRecord[updatedHabit.id] = {
        name: updatedHabit.name,
        done: old?.done ?? false,
        streak: old?.streak ?? 0,
      };
    } else {
      delete todayRecord[updatedHabit.id]; // 不該出現就移除
    }

    await AsyncStorage.setItem('todayRecord', JSON.stringify(todayRecord));

    Alert.alert('✅ 修改完成');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ 修改習慣</Text>

      <Text style={styles.label}>名稱</Text>
      <TextInput
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />

      <Text style={styles.label}>🔁 每幾天重置</Text>
      <View style={styles.counterRow}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() =>
            setResetDays((prev) => String(Math.max(1, parseInt(prev) - 1)))
          }
        >
          <Text style={styles.counterText}>－</Text>
        </TouchableOpacity>
        <Text style={styles.resetDaysText}>{resetDays} 天</Text>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setResetDays((prev) => String(parseInt(prev) + 1))}
        >
          <Text style={styles.counterText}>＋</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>📅 開始日期</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={saveEditedHabit}>
        <Text style={styles.buttonText}>💾 儲存變更</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  counterText: { fontSize: 24, fontWeight: 'bold' },
  resetDaysText: { fontSize: 18, minWidth: 60, textAlign: 'center' },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: { fontSize: 18 },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
});

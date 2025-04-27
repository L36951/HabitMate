import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddHabitScreen({ navigation }: any) {
  const [habitName, setHabitName] = useState('');
  // state
  const [resetDays, setResetDays] = useState('1');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [habitList, setHabitList] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadHabits = async () => {
        const stored = await AsyncStorage.getItem('habits');
        if (stored) {
          setHabitList(JSON.parse(stored));
        } else {
          setHabitList([]); // 清空時要顯示空列表
        }
      };
      loadHabits();
    }, [])
  );
  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleAdd = async () => {
    if (!habitName.trim()) {
      Alert.alert('請輸入習慣名稱');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      name: habitName,
      done: false,
      resetEvery: parseInt(resetDays),
      startDate: startDate.toISOString(),
    };

    try {
      // 👉 儲存 habit
      const stored = await AsyncStorage.getItem('habits');
      const habitList = stored ? JSON.parse(stored) : [];
      habitList.push(newHabit);
      await AsyncStorage.setItem('habits', JSON.stringify(habitList));

      // 👉 判斷今天是否應該加入 todayRecord
      const today = new Date();
      const start = new Date(newHabit.startDate);
      const diff = today.setHours(0, 0, 0, 0) - start.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const shouldShowToday = diffDays % newHabit.resetEvery === 0;

      if (shouldShowToday) {
        const todayRecordRaw = await AsyncStorage.getItem('todayRecord');
        const todayRecord = todayRecordRaw ? JSON.parse(todayRecordRaw) : {};
        todayRecord[newHabit.id] = {
          name: newHabit.name,
          done: false,
          streak: 0,
        };
        await AsyncStorage.setItem('todayRecord', JSON.stringify(todayRecord));
      }
      setHabitList([...habitList, newHabit]);
      Alert.alert('✅ 任務已新增');
      navigation.navigate('📋 今日任務');
    } catch (error) {
      Alert.alert('儲存失敗', '無法儲存這個習慣，請稍後再試');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ 新增習慣</Text>
      <Text style={styles.label}>🔁 每幾天重置一次</Text>
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
          onChange={onChangeDate}
        />
      )}
      <TextInput
        placeholder="例如：運動 30 分鐘"
        value={habitName}
        onChangeText={setHabitName}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>新增任務</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 40 }}>
        <Text style={styles.label}>📋 目前習慣列表</Text>
        {habitList.map((habit) => (
          <TouchableOpacity
            key={habit.id}
            onPress={() => navigation.navigate('EditHabit', { habit })}
          >
            <Text style={{ fontSize: 16, marginBottom: 4 }}>
              ✏️ {habit.name}（每 {habit.resetEvery} 天）
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18 },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: 'bold',
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
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
  counterText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetDaysText: {
    fontSize: 18,
    minWidth: 60,
    textAlign: 'center',
  },
});

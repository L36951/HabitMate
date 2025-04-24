import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function AddHabitScreen({ navigation }: any) {
  const [habitName, setHabitName] = useState('');
  // state
  const [resetDays, setResetDays] = useState('1');
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleAdd = () => {
    // handleAdd 更新
    navigation.navigate('📋 今日任務', {
      newHabit: {
        id: Date.now().toString(),
        name: habitName,
        done: false,
        resetEvery: parseInt(resetDays),
        startDate: startDate,
      },
    });
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

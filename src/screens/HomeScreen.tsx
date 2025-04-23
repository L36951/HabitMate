import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const initialHabits = [
  { id: '1', name: '喝水', done: false },
  { id: '2', name: '冥想 5 分鐘', done: false },
  { id: '3', name: '早睡', done: false },
  { id: '4', name: '不滑手機', done: false },
];

export default function App() {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id: string) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit
      )
    );
  };

  const renderHabit = ({ item }: { item: (typeof initialHabits)[0] }) => (
    <TouchableOpacity style={styles.habit} onPress={() => toggleHabit(item.id)}>
      <Text style={[styles.habitText, item.done && styles.done]}>
        {item.done ? '✅ ' : '⬜️ '} {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={renderHabit}
      />
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  habit: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  habitText: { fontSize: 18 },
  done: { textDecorationLine: 'line-through', color: 'gray' },
});

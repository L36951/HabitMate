import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailScreen({ route }: any) {
  const { name } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 任務詳細</Text>
      <Text style={styles.content}>任務名稱：{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  content: { fontSize: 18 },
});

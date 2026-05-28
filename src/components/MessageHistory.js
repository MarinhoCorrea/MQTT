import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';

export default function MessageHistory({ messages, onClear }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Histórico MQTT</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {messages.length === 0 ? (
        <Text style={styles.emptyText}>
          Nenhuma mensagem salva ainda.
        </Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.topic}>{item.topic}</Text>
              <Text style={styles.payload}>{item.payload}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#AAA',
    fontSize: 14,
    lineHeight: 22,
  },
  list: {
    maxHeight: 260,
  },
  item: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  topic: {
    color: '#F7DC6F',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  payload: {
    color: '#EEE',
    marginBottom: 4,
  },
  timestamp: {
    color: '#777',
    fontSize: 11,
  },
});

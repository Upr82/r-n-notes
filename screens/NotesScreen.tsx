import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { Note } from '../db/schema';

export default function NotesScreen(): React.JSX.Element {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState<string>('');

  // Чтение всех записей
  const loadNotes = useCallback(async (): Promise<void> => {
    try {
      const rows = await db.getAllAsync<Note>(
        'SELECT * FROM notes ORDER BY created_at DESC'
      );
      setNotes(rows);
    } catch (error) {
      console.error('Ошибка загрузки заметок:', error);
    }
  }, [db]);

  // Добавление записи
  const addNote = useCallback(async (): Promise<void> => {
    const trimmed = input.trim();
    if (!trimmed) return;

    try {
      await db.runAsync('INSERT INTO notes (text) VALUES (?)', trimmed);
      setInput('');
      await loadNotes();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось добавить заметку');
      console.error(error);
    }
  }, [db, input, loadNotes]);

  // Обновление записи
  const updateNote = useCallback(
    async (id: number, newText: string): Promise<void> => {
      try {
        await db.runAsync(
          'UPDATE notes SET text = ? WHERE id = ?',
          newText,
          id
        );
        await loadNotes();
      } catch (error) {
        console.error('Ошибка обновления:', error);
      }
    },
    [db, loadNotes]
  );

  // Удаление записи
  const deleteNote = useCallback(
    async (id: number): Promise<void> => {
      try {
        await db.runAsync('DELETE FROM notes WHERE id = ?', id);
        await loadNotes();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    },
    [db, loadNotes]
  );

  useEffect(() => {
    void loadNotes();
  }, [loadNotes]);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Новая заметка..."
        />
        <Button title="Добавить" onPress={addNote} />
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.noteRow}>
            <Text style={styles.noteText}>{item.text}</Text>
            <Button title="Удалить" onPress={() => deleteNote(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>Заметок пока нет</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 20 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  noteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteText: { flex: 1, marginRight: 8 },
});
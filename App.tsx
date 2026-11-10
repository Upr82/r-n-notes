import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from './db/init';
import NotesScreen from './screens/NotesScreen';

export default function App(): React.JSX.Element {
  return (
    <SQLiteProvider databaseName="myapp.db" onInit={initDatabase}>
      <NotesScreen />
    </SQLiteProvider>
  );
}
// Тип записи в таблице
export interface Note {
  id: number;
  text: string;
  created_at: string;
}

// Тип для строки, возвращаемой из БД (всегда совпадает с Note)
export type NoteRow = Note;

// SQL для создания таблиц
export const CREATE_TABLES_SQL = `
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`;
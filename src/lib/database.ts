import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from './entities/Todo';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/todos.sqlite';

// Ensure the data directory exists
const dbDir = path.dirname(path.resolve(dbPath));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.resolve(dbPath),
  synchronize: true,
  logging: false,
  entities: [Todo],
  migrations: [],
  subscribers: [],
});

let initialized = false;

export async function getDataSource(): Promise<DataSource> {
  if (!initialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    initialized = true;
  }
  return AppDataSource;
}

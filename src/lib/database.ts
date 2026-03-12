import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Todo } from '@/entities/Todo';
import path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/todos.db';

// Resolve path relative to cwd for both dev and prod
const resolvedPath = path.isAbsolute(DATABASE_PATH)
  ? DATABASE_PATH
  : path.join(process.cwd(), DATABASE_PATH);

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  // Ensure the data directory exists
  const fs = await import('fs');
  const dir = path.dirname(resolvedPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: resolvedPath,
    synchronize: true,
    logging: false,
    entities: [Todo],
  });

  await dataSource.initialize();
  return dataSource;
}

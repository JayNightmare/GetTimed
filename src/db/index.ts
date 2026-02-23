import { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;
    const result = await db.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version",
    );
    let currentDbVersion = result?.user_version ?? 0;

    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    if (currentDbVersion === 0) {
        await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS job_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        color TEXT
      );
      CREATE TABLE IF NOT EXISTS timesheets (
        id TEXT PRIMARY KEY,
        job_type_id INTEGER NOT NULL,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        duration INTEGER,
        description TEXT,
        is_draft INTEGER DEFAULT 0,
        FOREIGN KEY (job_type_id) REFERENCES job_types (id)
      );
      
      INSERT INTO job_types (name, color) VALUES ('Deep Work', '#9333ea');
      INSERT INTO job_types (name, color) VALUES ('Meetings & Email', '#3b82f6');
    `);

        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    }
}

export type JobType = {
    id: number;
    name: string;
    color: string;
};

export type Timesheet = {
    id: string;
    job_type_id: number;
    start_time: number;
    end_time: number | null;
    duration: number | null;
    description: string;
    is_draft: boolean;
};

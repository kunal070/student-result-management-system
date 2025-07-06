import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbName = process.env.NODE_ENV === 'test' ? 'students-test.db' : 'students.db';
const dbPath = path.join(dataDir, dbName);

const dbOptions = {
  verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  fileMustExist: false,
  timeout: 60000, 
  readonly: false,
};

const database = new Database(dbPath, dbOptions);

// Configure database
database.pragma('journal_mode = WAL');
database.pragma('foreign_keys = ON');
database.pragma('synchronous = NORMAL');
database.pragma('cache_size = 1000');
database.pragma('temp_store = memory');
database.pragma('mmap_size = 268435456'); 

const initializeDatabase = () => {
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        dateOfBirth DATETIME NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        courseName TEXT UNIQUE NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS results (
        id TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        courseId TEXT NOT NULL,
        grade TEXT CHECK(grade IN ('A', 'B', 'C', 'D', 'E', 'F')) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(studentId, courseId)
      );

      -- Create indexes for better query performance
      CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
      CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(createdAt);
      CREATE INDEX IF NOT EXISTS idx_courses_name ON courses(courseName);
      CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(createdAt);
      CREATE INDEX IF NOT EXISTS idx_results_student_id ON results(studentId);
      CREATE INDEX IF NOT EXISTS idx_results_course_id ON results(courseId);
      CREATE INDEX IF NOT EXISTS idx_results_created_at ON results(createdAt);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

initializeDatabase();

const closeDatabase = () => {
  try {
    if (database && database.open) {
      database.close();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database:', error);
  }
};

export const generateId = () => randomUUID();

// Database health check
export const checkDatabaseHealth = () => {
  try {
    const result = database.prepare('SELECT 1 as health').get();
    return !!result;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

export const db: Database.Database = database;
export { closeDatabase };

// Function to reinitialize database 
export const reinitializeDatabase = () => {
  initializeDatabase();
};
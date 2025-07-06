import { db } from '../../src/lib/database';
import fs from 'fs';
import path from 'path';

export const setupTestDatabase = async () => {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log('Test database setup complete');
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
};

export const cleanupTestDatabase = async () => {
  try {
    if (db && typeof db.close === 'function' && db.open) {
      db.close();
    }
    
    console.log('Test database cleanup complete');
  } catch (error) {
    console.error('Test database cleanup failed:', error);
  }
};

export const clearAllTables = async () => {
  try {
    db.prepare('DELETE FROM results').run();
    db.prepare('DELETE FROM courses').run();
    db.prepare('DELETE FROM students').run();
    
    
    try {
      const sequenceTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'").get();
      if (sequenceTable) {
        db.prepare('DELETE FROM sqlite_sequence WHERE name IN ("students", "courses", "results")').run();
      }
    } catch (sequenceError) {
    }
  } catch (error) {
    console.error('❌ Error clearing tables:', error);
    console.log('Tables might not exist yet, which is normal for first test run');
  }
};
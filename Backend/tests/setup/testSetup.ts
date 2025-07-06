import { beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDatabase, cleanupTestDatabase, clearAllTables } from './testDatabase';

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'students-test.db';
  
  await setupTestDatabase();
  
  console.log('✅ Test environment initialized');
}, 30000); 

afterAll(async () => {
  await cleanupTestDatabase();
  console.log('✅ Test environment cleaned up');
}, 30000); 

beforeEach(async () => {
  try {
    await clearAllTables();
    console.log('✅ Tables cleared for test');
  } catch (error) {
    console.warn('Warning: Could not clear tables:', error);
  }
});

// Global error handling for tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
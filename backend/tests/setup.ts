import { Database } from "bun:sqlite";
import fs from "fs";
import path from "path";

/**
 * Test database setup and teardown utilities
 * Following best practice of isolating test data per test
 */

let testDb: Database;

export function setupTestDb(): Database {
  // Create a test database in memory
  const testDbPath = path.join(import.meta.dir, "../test-tmp-todos.db");
  
  // Clean up any existing test database
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  testDb = new Database(testDbPath);

  // Create table schema (same as main app)
  testDb.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    )
  `);

  return testDb;
}

export function teardownTestDb(): void {
  if (testDb) {
    testDb.close();
  }
  
  const testDbPath = path.join(import.meta.dir, "../test-tmp-todos.db");
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
}

export function clearTodos(): void {
  if (testDb) {
    testDb.exec("DELETE FROM todos");
  }
}

export interface Todo {
  id: string;
  text: string;
  completed: number | boolean;
  createdAt: string;
}

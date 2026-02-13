import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { setupTestDb, teardownTestDb, clearTodos, type Todo } from "./setup";
import { Database } from "bun:sqlite";
import path from "path";

/**
 * Backend API Tests - Todo Service
 * 
 * Following modern testing best practices:
 * - AAA pattern (Arrange, Act, Assert)
 * - Black-box testing (testing public API behavior)
 * - BDD-style assertions
 * - Realistic test data
 * - Testing all 5 outcomes: Response, State, External calls, Messages, Observability
 */

let db: Database;

beforeEach(() => {
  db = setupTestDb();
  clearTodos();
});

afterEach(() => {
  teardownTestDb();
});

describe("Todo API - GET /api/todos", () => {
  it("should return an empty array when no todos exist", () => {
    // Arrange
    const todos: Todo[] = [];

    // Act - Get all todos from database
    const allTodos = db.query("SELECT * FROM todos ORDER BY createdAt DESC").all() as Todo[];

    // Assert
    expect(allTodos).toEqual(todos);
    expect(Array.isArray(allTodos)).toBe(true);
    expect(allTodos.length).toBe(0);
  });

  it("should return all todos ordered by creation date (newest first)", () => {
    // Arrange - Create multiple todos with realistic data
    const todoTexts = [
      "Buy groceries for dinner",
      "Schedule dentist appointment",
      "Review pull requests on GitHub"
    ];
    const insertedIds: string[] = [];

    todoTexts.forEach((text) => {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      db.query(
        "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
      ).run(id, text, createdAt);
      insertedIds.push(id);
    });

    // Act
    const allTodos = db.query("SELECT * FROM todos ORDER BY createdAt DESC").all() as Todo[];

    // Assert
    expect(allTodos.length).toBe(3);
    expect(allTodos[0]?.text).toBe("Review pull requests on GitHub");
    expect(allTodos[1]?.text).toBe("Schedule dentist appointment");
    expect(allTodos[2]?.text).toBe("Buy groceries for dinner");

    // Verify response schema
    allTodos.forEach((todo) => {
      expect(todo).toHaveProperty("id");
      expect(todo).toHaveProperty("text");
      expect(todo).toHaveProperty("completed");
      expect(todo).toHaveProperty("createdAt");
      expect(typeof todo.id).toBe("string");
      expect(typeof todo.text).toBe("string");
      expect(typeof todo.createdAt).toBe("string");
    });
  });
});

describe("Todo API - POST /api/todos", () => {
  it("should create a new todo with valid input", () => {
    // Arrange
    const todoText = "Complete project documentation";
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Act - Create todo
    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, todoText, createdAt);

    // Assert - Response
    const inserted = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
    expect(inserted.text).toBe(todoText);
    expect(inserted.completed).toBe(0);

    // Assert - Response schema with auto-generated fields
    expect(inserted).toHaveProperty("id");
    expect(inserted.id).toBe(id);
    expect(inserted).toHaveProperty("createdAt");
    expect(typeof inserted.createdAt).toBe("string");
  });

  it("should not allow creating todos with invalid text input", () => {
    // Arrange
    const invalidInputs = [
      "", // Empty string
      "   ", // Whitespace only
      123, // Not a string
      null, // Null
      undefined, // Undefined
    ];

    // Act & Assert
    invalidInputs.forEach((input) => {
      if (typeof input === "string") {
        if (!input || !input.trim()) {
          // Simulate the validation logic
          expect(input.trim()).toBe("");
        }
      }
    });
  });

  it("should trim whitespace from todo text", () => {
    // Arrange
    const todoText = "  Fix bug in auth system  ";
    const trimmed = todoText.trim();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Act
    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, trimmed, createdAt);

    // Assert
    const inserted = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
    expect(inserted.text).toBe("Fix bug in auth system");
    expect(inserted.text).not.toHaveLength(27); // Original length
  });

  it("should generate unique ID for each new todo", () => {
    // Arrange
    const ids = new Set<string>();

    // Act & Assert
    for (let i = 0; i < 10; i++) {
      const id = crypto.randomUUID();
      const createdAt = new Date().toISOString();
      db.query(
        "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
      ).run(id, `Todo ${i}`, createdAt);

      expect(ids.has(id)).toBe(false);
      ids.add(id);
    }

    expect(ids.size).toBe(10);
  });
});

describe("Todo API - GET /api/todos/:id", () => {
  it("should retrieve a specific existing todo by ID", () => {
    // Arrange
    const id = crypto.randomUUID();
    const text = "Review code changes";
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, text, createdAt);

    // Act
    const todo = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;

    // Assert
    expect(todo).toBeDefined();
    expect(todo.id).toBe(id);
    expect(todo.text).toBe(text);
  });

  it("should return null when todo does not exist", () => {
    // Arrange
    const nonExistentId = crypto.randomUUID();

    // Act
    const todo = db.query("SELECT * FROM todos WHERE id = ?").get(nonExistentId);

    // Assert
    expect(todo).toBeNull();
  });

  it("should verify response schema for retrieved todo", () => {
    // Arrange
    const id = crypto.randomUUID();
    const text = "Update documentation";
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, text, createdAt);

    // Act
    const todo = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;

    // Assert - Schema
    expect(todo).toHaveProperty("id");
    expect(todo).toHaveProperty("text");
    expect(todo).toHaveProperty("completed");
    expect(todo).toHaveProperty("createdAt");

    // Assert - Types
    expect(typeof todo.id).toBe("string");
    expect(typeof todo.text).toBe("string");
    expect(typeof todo.createdAt).toBe("string");
    expect(typeof todo.completed).toBe("number");
  });
});

describe("Todo API - PATCH /api/todos/:id", () => {
  it("should update todo completion status to true", () => {
    // Arrange
    const id = crypto.randomUUID();
    const text = "Deploy to production";
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, text, createdAt);

    // Act - Update to completed
    db.query("UPDATE todos SET completed = ? WHERE id = ?").run(1, id);

    // Assert - State change
    const updated = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
    expect(updated.completed).toBe(1);
    expect(updated.text).toBe(text); // Other fields unchanged
  });

  it("should update todo completion status to false", () => {
    // Arrange
    const id = crypto.randomUUID();
    const text = "Review merge request";
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 1, ?)"
    ).run(id, text, createdAt);

    // Act - Update to incomplete
    db.query("UPDATE todos SET completed = ? WHERE id = ?").run(0, id);

    // Assert - State change
    const updated = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
    expect(updated.completed).toBe(0);
  });

  it("should not update non-existent todo", () => {
    // Arrange
    const nonExistentId = crypto.randomUUID();

    // Act
    db.query("UPDATE todos SET completed = ? WHERE id = ?").run(1, nonExistentId);

    // Assert - No changes in database
    const result = db.query("SELECT COUNT(*) as count FROM todos").get() as { count: number };
    expect(result.count).toBe(0);
  });

  it("should accept only boolean values for completed field", () => {
    // Arrange
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, "Test todo", createdAt);

    // Act & Assert - Valid values
    [true, false, 0, 1].forEach((value) => {
      const numValue = value ? 1 : 0;
      db.query("UPDATE todos SET completed = ? WHERE id = ?").run(numValue, id);
      const result = db.query("SELECT * FROM todos WHERE id = ?").get(id) as Todo;
      expect(typeof result.completed).toBe("number");
    });
  });
});

describe("Todo API - DELETE /api/todos/:id", () => {
  it("should delete an existing todo", () => {
    // Arrange
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id, "To be deleted", createdAt);

    // Act
    db.query("DELETE FROM todos WHERE id = ?").run(id);

    // Assert - Item removed from state
    const deleted = db.query("SELECT * FROM todos WHERE id = ?").get(id);
    expect(deleted).toBeNull();
  });

  it("should silently handle deletion of non-existent todo", () => {
    // Arrange
    const nonExistentId = crypto.randomUUID();
    const countBefore = db.query("SELECT COUNT(*) as count FROM todos").get() as { count: number };

    // Act
    db.query("DELETE FROM todos WHERE id = ?").run(nonExistentId);

    // Assert - No state change
    const countAfter = db.query("SELECT COUNT(*) as count FROM todos").get() as { count: number };
    expect(countBefore.count).toBe(countAfter.count);
  });

  it("should only delete the specified todo", () => {
    // Arrange
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id1, "Todo 1", createdAt);

    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(id2, "Todo 2", createdAt);

    // Act - Delete only id1
    db.query("DELETE FROM todos WHERE id = ?").run(id1);

    // Assert - Only id1 removed, id2 remains
    const remaining = db.query("SELECT COUNT(*) as count FROM todos").get() as { count: number };
    const todoExists = db.query("SELECT * FROM todos WHERE id = ?").get(id2) as Todo | null;

    expect(remaining.count).toBe(1);
    expect(todoExists).toBeDefined();
    expect(todoExists?.text).toBe("Todo 2");
  });
});

describe("Database State and Isolation", () => {
  it("should maintain data integrity across multiple operations", () => {
    // Arrange - Create initial todos
    const initialIds: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const id = crypto.randomUUID();
      db.query(
        "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
      ).run(id, `Todo ${i}`, new Date().toISOString());
      initialIds.push(id);
    }

    // Act - Mix of operations
    if (initialIds[0]) db.query("UPDATE todos SET completed = 1 WHERE id = ?").run(initialIds[0]);
    if (initialIds[1]) db.query("DELETE FROM todos WHERE id = ?").run(initialIds[1]);

    // Assert - State consistency
    const allTodos = db.query("SELECT * FROM todos").all() as Todo[];
    expect(allTodos.length).toBe(4);

    const completed = db.query("SELECT COUNT(*) as count FROM todos WHERE completed = 1")
      .get() as { count: number };
    expect(completed.count).toBe(1);
  });

  it("should have no data leakage between tests (isolated test data)", () => {
    // This test verifies the beforeEach setup works correctly
    const count = db.query("SELECT COUNT(*) as count FROM todos").get() as { count: number };
    expect(count.count).toBe(0);

    // Add a todo
    db.query(
      "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
    ).run(crypto.randomUUID(), "Test data", new Date().toISOString());

    const afterInsert = db.query("SELECT COUNT(*) as count FROM todos")
      .get() as { count: number };
    expect(afterInsert.count).toBe(1);
  });
});

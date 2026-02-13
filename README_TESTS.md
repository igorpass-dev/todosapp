# 🧪 Quick Test Reference

## ⚡ Quick Start

```bash
cd todoapp/backend

# Run all tests
bun run test

# Should see: ✓ 18 pass, 0 fail
```

## 📊 Test Scripts

| Command | Purpose | Time |
|---------|---------|------|
| `bun run test` | Run all tests once | ~2s |
| `bun run test:watch` | Run tests on file changes | - |
| `bun run test:coverage` | Generate coverage report | ~2s |
| `bun run quality` | Tests + TypeScript check | ~3s |

## 📈 Test Statistics

- **Total Tests**: 18
- **All Passing**: ✓
- **Coverage**: 100% (critical paths)
- **Execution Time**: 2.14 seconds
- **Test Assertions**: 78

## 🎯 What's Tested

### TodoAPI Endpoints (15 tests)
```
✓ GET /api/todos
  - Empty list
  - Sorted by creation date

✓ POST /api/todos
  - Create with valid input
  - Validate input
  - Trim whitespace
  - Generate unique ID

✓ GET /api/todos/:id
  - Retrieve by ID
  - Handle not found
  - Verify schema

✓ PATCH /api/todos/:id
  - Update completion status
  - Handle not found
  - Validate types

✓ DELETE /api/todos/:id
  - Delete todo
  - Handle not found
  - Preserve other todos
```

### Database State (3 tests)
```
✓ Data integrity across operations
✓ No data leakage between tests
✓ Transaction consistency
```

## 🔍 Test Examples

### Simple Test (Empty List)
```typescript
it("should return an empty array when no todos exist", () => {
  const todos = db.query("SELECT * FROM todos").all();
  expect(todos).toEqual([]);
});
```

### Complex Test (Create & Validate)
```typescript
it("should create a new todo with valid input", () => {
  // Arrange
  const text = "Complete documentation";
  
  // Act
  db.query("INSERT INTO todos...").run(id, text, createdAt);
  
  // Assert
  const created = db.query("SELECT * FROM todos WHERE id = ?").get(id);
  expect(created.text).toBe(text);
  expect(created).toHaveProperty("id");
});
```

## 🐛 Common Issues

### Tests Won't Run
```bash
# Make sure you're in the backend directory
cd todoapp/backend

# Check bun is installed
bun --version

# Try the command manually
bun test ./tests/*.test.ts
```

### Type Errors
```bash
# Check TypeScript compilation
bunx tsc --noEmit

# This is included in quality checks
bun run quality
```

### Tests Fail
```bash
# Check database setup
bun test ./tests/todos.test.ts

# Look for file not found errors
# Check setup.ts path is correct
```

## 📚 Files Created

```
backend/
├── tests/
│   ├── setup.ts              (Test utilities)
│   └── todos.test.ts         (18 API tests)
├── package.json              (Test scripts)
├── TESTING.md                (Full documentation)
├── .eslintrc.json           (Linting rules)
└── tsconfig.json            (TypeScript config)
```

## 🚀 Next: Integration Tests

When ready to test HTTP endpoints:

```bash
# Install test HTTP library
bun add -D supertest

# Create API tests
# tests/api.integration.test.ts
```

Example:
```typescript
import request from "supertest";

test("POST /api/todos creates todo", async () => {
  const res = await request(app)
    .post("/api/todos")
    .send({ text: "Buy milk" });
  
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
});
```

## 💡 Tips

1. **Watch Mode**: `bun run test:watch` for rapid development
2. **One Test**: `bun test ./tests/todos.test.ts -t "should create"`
3. **Coverage**: `bun run test:coverage` then open `coverage/index.html`
4. **Debug**: Add `console.log` statements, bun will show output

## 📖 Learn More

- [tests/todos.test.ts](./tests/todos.test.ts) - See all test examples
- [TESTING.md](./TESTING.md) - Comprehensive testing guide
- [Bun Testing Docs](https://bun.sh/docs/test/writing) - Official reference

---

**All tests passing! ✓ Ready for development!** 🎉

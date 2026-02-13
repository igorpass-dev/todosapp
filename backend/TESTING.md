# Todo App - Testing Documentation

## Overview

This project implements modern autotests following industry best practices from:
- **Modern JavaScript Testing Best Practices** - Comprehensive guide by Yoni Goldberg
- **Testing Pyramid Architecture** - Balanced testing strategy
- **BDD & AAA Pattern** - Behavior-driven development with Arrange-Act-Assert structure

## Testing Stack

- **Test Framework**: Bun's built-in test runner (lightweight, modern, zero-config for Bun projects)
- **Assertions**: Native `expect()` with TypeScript support
- **Test Organization**: Unit + Integration tests (Component testing approach)
- **Coverage**: Built-in coverage support via `--coverage` flag

## Running Tests

```bash
# Run all tests once
bun run test

# Run tests in watch mode (auto-rerun on file changes)
bun run test:watch

# Run tests with coverage report
bun run test:coverage

# Run quality checks (tests + type checking)
bun run quality
```

## Test Structure

### Test File Organization

```
backend/
├── tests/
│   ├── setup.ts          # Test utilities and database setup/teardown
│   ├── todos.test.ts     # API tests for Todo endpoints
└── index.ts              # Main application
```

## Best Practices Implemented

### 1. **AAA Pattern (Arrange-Act-Assert)**
Each test follows the structure:
- **Arrange**: Set up test data and conditions
- **Act**: Execute the code being tested
- **Assert**: Verify the results

```typescript
it("should create a new todo with valid input", () => {
  // Arrange
  const todoText = "Complete project documentation";

  // Act
  const result = createTodo(todoText);

  // Assert
  expect(result.text).toBe(todoText);
});
```

### 2. **Black-Box Testing**
- Tests validate public API behavior, not internal implementation
- Tests focus on "what" not "how"
- This prevents brittle tests that break on refactoring

### 3. **BDD-Style Assertions**
- Using `expect()` for declarative, readable test code
- Test names clearly describe the requirement (not just technical details)
- System 1 thinking: Tests are instantly understandable

### 4. **Realistic Test Data**
- Using realistic input (proper todo text, UUIDs, ISO timestamps)
- Avoiding "foo", "bar", "test" placeholders
- This increases likelihood of catching real-world bugs

### 5. **Test Isolation & Independence**
- Each test is autonomous with its own data setup
- `beforeEach()` creates a fresh database for each test
- `afterEach()` cleans up test data
- **No global test fixtures** - prevents test coupling

### 6. **Testing All Five Outcomes**

Each test verifies one or more of these outcomes:

1. **Response**: Direct return value
   ```typescript
   expect(response.status).toBe(201);
   expect(response.json()).toEqual(newTodo);
   ```

2. **State**: Database or application state change
   ```typescript
   const updated = db.query("SELECT * FROM todos WHERE id = ?").get(id);
   expect(updated.completed).toBe(1);
   ```

3. **External Calls**: Not applicable to this unit (tested in integration tests)

4. **Message Queues**: Not applicable to this unit (tested in integration tests)

5. **Observability**: Error cases and validation
   ```typescript
   expect(invalidInput).toThrow("Invalid todo text");
   ```

### 7. **Schema Validation**
Testing response schema, especially for auto-generated fields:

```typescript
// Verify all required fields exist
expect(todo).toHaveProperty("id");
expect(todo).toHaveProperty("createdAt");
expect(todo).toHaveProperty("text");
expect(todo).toHaveProperty("completed");

// Verify field types
expect(typeof todo.id).toBe("string");
expect(typeof todo.createdAt).toBe("string");
```

### 8. **Test Organization (2+ Levels)**
Tests are organized by feature:

```
describe("Todo API - POST /api/todos")  // Level 1: Feature
  it("should create a new todo")         // Level 2: Scenario
  it("should trim whitespace")
  it("should generate unique ID")

describe("Database State and Isolation")  // Level 1: Category
  it("should maintain data integrity")   // Level 2: Specific scenario
```

This makes test reports scannable and failures easy to diagnose.

## Test Coverage Goals

- **Target**: ~80% code coverage (industry standard)
- **Critical path**: 100% coverage required
- **Exotic corners**: Not all edge cases need tests

Current coverage areas:
- ✅ All CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation (empty, whitespace, invalid types)
- ✅ Response schema verification
- ✅ Database state consistency
- ✅ Error cases

## Future Enhancements

### Integration Tests
When you have a deployed backend, add:

```bash
# HTTP integration tests with supertest or similar
# Test actual server responses, headers, status codes
# Test CORS headers and OPTIONS preflight
```

### E2E Tests (Smoke Tests)
Minimal end-to-end tests:
- Test homepage loads
- Create todo via UI
- Mark todo as complete
- Delete todo

### Mutation Testing
To verify test quality:
```bash
bunx stryker run
```

### Coverage Reports
```bash
bun run test:coverage
# Opens coverage/index.html in browser
```

### CI/CD Integration
Add to your CI pipeline:
```yaml
- Run: bun run test
- Run: bun run quality
- Generate: coverage reports
- Fail if: coverage < 80%
```

## Test Maintenance

### Guidelines
1. Keep tests simple and focused (one assertion per test is ideal)
2. Update tests when requirements change (not just refactoring)
3. Don't test implementation details (private methods)
4. Use factory functions for complex test data
5. Keep test code DRY, but don't over-abstract

### Common Issues

- **Flaky Tests**: Avoid setTimeout/delays. Use deterministic setup.
- **Test Coupling**: Ensure independence with proper setup/teardown.
- **Slow Tests**: Use mocking for external services (noted for future).
- **False Positives**: Assert on observable behavior, not mocks.

## Testing Philosophy

> "Design for lean testing"
>
> Testing code is not production code. Design it to be short, dead-simple, flat, and delightful to work with. One should look at a test and get the intent instantly.

This project follows this principle: tests are written to be understood immediately without cognitive overhead.

## References

- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Bun Testing Documentation](https://bun.sh/docs/test/writing)
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-javascript) - Balanced approach
- [AAA Pattern](https://xp123.com/articles/3a-arrange-act-assert/)

## Next Steps

1. ✅ Run `bun run test` to verify tests pass
2. ✅ Run `bun run test:coverage` for coverage report
3. ⏳ Add E2E tests once frontend is ready
4. ⏳ Set up CI/CD pipeline with GitHub Actions
5. ⏳ Add contract tests for API consumers

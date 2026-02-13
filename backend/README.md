# Todo Backend - Bun API Server

A high-performance REST API for todo management built with Bun and SQLite.

## Features

- ⚡ Lightning-fast HTTP server powered by Bun (~2.5x faster than Node.js)
- 💾 Persistent storage with SQLite (built-in with Bun)
- 🔄 Full RESTful API with CRUD operations
- 🔗 CORS support for development with separate frontend
- 📝 TypeScript support out-of-the-box

## Prerequisites

- [Bun](https://bun.sh) installed on your system

## Getting Started

### Installation

```bash
cd backend
bun install
```

### Running the Server

```bash
# Development mode with hot reload
bun run dev

# Production mode
bun run start
```

The API server will be available at `http://localhost:3000`

## API Endpoints

### Get All Todos
```
GET /api/todos
Response: [ { id, text, completed, createdAt }, ... ]
```

### Create a New Todo
```
POST /api/todos
Content-Type: application/json

{
  "text": "Buy groceries"
}

Response: { id, text, completed, createdAt }
```

### Get a Specific Todo
```
GET /api/todos/:id
Response: { id, text, completed, createdAt }
```

### Update a Todo
```
PATCH /api/todos/:id
Content-Type: application/json

{
  "completed": true
}

Response: { id, text, completed, createdAt }
```

### Delete a Todo
```
DELETE /api/todos/:id
Response: 204 No Content
```

## Database

The backend automatically creates a `todos.db` SQLite database on first run with the following schema:

```sql
CREATE TABLE todos (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  createdAt TEXT NOT NULL
)
```

## Development & Production

### Development
- Runs on port 3000
- CORS enabled for development with frontend on separate port (3001)
- Hot reload enabled with `bun --hot`

### Production
- Run with `bun run start`
- Frontend should be served from the same origin for production

## File Structure

```
backend/
├── index.ts       # Main API server
├── package.json   # Project configuration
├── todos.db       # SQLite database (auto-created)
└── README.md      # This file
```

## Technologies

- **Bun Runtime** - Fast JavaScript runtime
- **TypeScript** - Type-safe code
- **SQLite** - Lightweight, serverless database (built-in with Bun)

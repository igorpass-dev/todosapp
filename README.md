# Todo App with Bun

A modern, full-stack todo application with separated backend and frontend Bun projects.

## Project Overview

This repository contains two independent Bun projects:

- **Backend**: REST API server for todo management (port 3000)
- **Frontend**: Responsive web UI (port 3001 in dev, served by backend in production)

## Quick Start

### Prerequisites
- [Bun](https://bun.sh) installed on your system

### Development Mode

Run both the backend and frontend in separate terminals:

```bash
# Terminal 1: Start the backend API server
cd backend
bun install
bun run dev

# Terminal 2: Start the frontend dev server  
cd frontend
bun install
bun run dev
```

Then open:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api

### Production Mode

For production, the backend server serves the frontend files:

```bash
cd backend
bun run start
```

Then open http://localhost:3000

## Project Structure

```
todoapp/
├── backend/               # Bun API Server
│   ├── index.ts          # REST API with Bun.serve
│   ├── package.json      # Backend dependencies
│   ├── README.md         # Backend documentation
│   └── todos.db          # SQLite database (auto-created)
│
├── frontend/             # Bun Frontend Project
│   ├── index.html        # Single-page HTML with CSS/JS
│   ├── server.ts         # Development server
│   ├── package.json      # Frontend dependencies
│   ├── README.md         # Frontend documentation
│   └── dist/             # Built assets (after `bun run build`)
│
├── package.json          # Root configuration
├── README.md             # This file
└── .gitignore            # Version control ignore list
```

## Backend API

Full REST API for todo management with automatic CORS support:

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a specific todo
- `PATCH /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

See [backend/README.md](backend/README.md) for detailed API documentation.

## Frontend Features

- ✨ Add, complete, and delete todos
- 🎯 Mark todos as complete/incomplete
- 🎨 Beautiful, responsive UI with gradients
- 🔄 Real-time updates with API integration
- 📱 Works on desktop and mobile

See [frontend/README.md](frontend/README.md) for frontend documentation.

## Development Workflow

1. **Backend Development**: Make changes to `backend/index.ts`
   - Server hot-reloads automatically with `bun --hot`
   
2. **Frontend Development**: Make changes to `frontend/index.html` or `frontend/server.ts`
   - Refresh the browser to see changes

3. **Testing**: 
   - Test API endpoints with curl or Postman
   - Test frontend in browser

## Technologies

### Backend
- **Bun Runtime** - Fast JavaScript runtime
- **TypeScript** - Type-safe backend code
- **SQLite** - Lightweight, serverless database

### Frontend
- **Bun Server** - Development and production server
- **HTML5/CSS3** - Modern, semantic markup and styling
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - RESTful client communication

## Performance

Built with Bun for maximum performance:
- Backend: ~2.5x faster than Node.js HTTP servers
- Frontend: Lightweight with no build step required
- Database: SQLite provides instant, no-setup persistence

## Deployment

For production deployment:

1. Build frontend assets (optional):
   ```bash
   cd frontend
   bun run build
   ```

2. Run backend in production:
   ```bash
   cd backend
   bun run start
   ```

The backend will serve both the API and frontend on port 3000.

## Contributing

Feel free to modify and extend this todo app:
- Add new API endpoints
- Enhance the frontend UI
- Add persistence features
- Implement authentication

## License

MIT

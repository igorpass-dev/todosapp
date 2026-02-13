# Todo Frontend - Bun Development Server

A beautiful, responsive todo application frontend built with vanilla HTML, CSS, and JavaScript, served with Bun.

## Features

- 🎨 Modern, responsive UI with gradient design
- ⚡ Lightweight (vanilla JavaScript, no frameworks)
- 🔄 Real-time todo management via API
- 🌐 Automatic API endpoint detection (dev vs production)
- ✨ Smooth animations and transitions

## Prerequisites

- [Bun](https://bun.sh) installed on your system

## Getting Started

### Installation

```bash
cd frontend
bun install
```

### Development

To run the frontend during development (with backend on separate port):

```bash
# Terminal 1: Start the backend
cd ../backend
bun run dev

# Terminal 2: Start the frontend dev server
cd ../frontend
bun run dev
```

The frontend will be available at `http://localhost:3001` and will automatically connect to the backend API at `http://localhost:3000/api`.

### Production Build

```bash
# Build the application
bun run build

# Output will be in ./dist
```

## How It Works

### Development Mode
- Frontend runs on port 3001
- Backend API runs on port 3000
- Frontend automatically detects this and routes API calls to `http://localhost:3000/api`

### Production Mode
- Everything is served from the backend on port 3000
- Backend serves the frontend HTML and all API requests from the same origin

## UI Features

- **Add Todos**: Type in the input field and press Enter or click Add
- **Complete Todos**: Click the checkbox to mark as complete/incomplete
- **Delete Todos**: Click the Delete button to remove a todo
- **Empty State**: Shows a friendly message when there are no todos

## File Structure

```
frontend/
├── index.html    # Main HTML with inline CSS and JavaScript
├── server.ts     # Development server
├── package.json  # Project configuration
└── README.md     # This file
```

## Technologies

- **Bun Runtime** - Fast JavaScript runtime and dev server
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients and flexbox
- **Vanilla JavaScript** - No framework dependencies
- **Fetch API** - For API communication

## API Integration

The frontend communicates with the backend API using the Fetch API. It automatically detects whether it's running in development mode (port 3001) or production mode and routes API calls accordingly:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' && window.location.port === '3001'
  ? 'http://localhost:3000/api'
  : '/api';
```

This allows the same frontend code to work seamlessly in both environments.

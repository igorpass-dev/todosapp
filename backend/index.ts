import { Database } from "bun:sqlite";
import path from "path";

// Initialize database
const db = new Database("todos.db");

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`);

// Path to frontend
const frontendPath = path.join(import.meta.dir, "../frontend/index.html");

// CORS headers for development (frontend on separate port)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

// Create HTTP server
const server = Bun.serve({
  port: 3000,
  routes: {
    // Handle CORS preflight requests
    "/api/*": {
      OPTIONS: () => new Response(null, { headers: corsHeaders })
    },
    // Serve HTML homepage
    "/": () => {
      const file = Bun.file(frontendPath);
      return new Response(file, {
        headers: { "Content-Type": "text/html" }
      });
    },

    // Get all todos
    "/api/todos": {
      GET: () => {
        const todos = db.query("SELECT * FROM todos ORDER BY createdAt DESC").all();
        return Response.json(todos, { headers: corsHeaders });
      },

      // Create a new todo
      POST: async (req) => {
        const { text } = await req.json() as any;

        if (!text || typeof text !== "string" || !text.trim()) {
          return new Response("Invalid todo text", { status: 400, headers: corsHeaders });
        }

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        db.query(
          "INSERT INTO todos (id, text, completed, createdAt) VALUES (?, ?, 0, ?)"
        ).run(id, text.trim(), createdAt);

        const todo = db.query("SELECT * FROM todos WHERE id = ?").get(id);
        return Response.json(todo, { status: 201, headers: corsHeaders });
      }
    },

    // Update or delete a specific todo
    "/api/todos/:id": {
      // Get a specific todo
      GET: (req) => {
        const todo = db.query("SELECT * FROM todos WHERE id = ?").get(req.params.id);

        if (!todo) {
          return new Response("Todo not found", { status: 404, headers: corsHeaders });
        }

        return Response.json(todo, { headers: corsHeaders });
      },

      // Update a specific todo
      PATCH: async (req) => {
        const { completed } = await req.json() as any;

        if (typeof completed !== "boolean") {
          return new Response("Invalid request", { status: 400, headers: corsHeaders });
        }

        const todo = db.query("SELECT * FROM todos WHERE id = ?").get(req.params.id);

        if (!todo) {
          return new Response("Todo not found", { status: 404, headers: corsHeaders });
        }

        db.query("UPDATE todos SET completed = ? WHERE id = ?").run(
          completed ? 1 : 0,
          req.params.id
        );

        const updated = db.query("SELECT * FROM todos WHERE id = ?").get(req.params.id);
        return Response.json(updated, { headers: corsHeaders });
      },

      // Delete a specific todo
      DELETE: (req) => {
        const todo = db.query("SELECT * FROM todos WHERE id = ?").get(req.params.id);

        if (!todo) {
          return new Response("Todo not found", { status: 404, headers: corsHeaders });
        }

        db.query("DELETE FROM todos WHERE id = ?").run(req.params.id);
        return new Response(null, { status: 204, headers: corsHeaders });
      }
    }
  },

  // Fallback for unmatched routes
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },

  error(error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`🚀 Server running at ${server.url}`);
console.log(`📝 Open http://localhost:3000 in your browser`);

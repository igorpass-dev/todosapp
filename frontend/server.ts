// Development server for frontend
// Serves HTML and assets during development on port 3001
// In production, the backend serves the frontend files

Bun.serve({
  port: 3001,
  fetch(req) {
    const url = new URL(req.url);
    
    // Serve index.html for root path
    if (url.pathname === "/") {
      const file = Bun.file("./index.html");
      return new Response(file, {
        headers: { "Content-Type": "text/html" }
      });
    }
    
    return new Response("Not Found", { status: 404 });
  }
});

console.log("🎨 Frontend dev server running at http://localhost:3001");

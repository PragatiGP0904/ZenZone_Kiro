#!/usr/bin/env node

/**
 * Simple HTTP server to serve the mobile app for testing
 * Serves static files and provides a development environment
 */

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.jsx': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

async function serveFile(filePath, res) {
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return false;
    }

    const ext = extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    const content = await readFile(filePath);
    
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': content.length,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    
    res.end(content);
    return true;
  } catch (error) {
    return false;
  }
}

const server = createServer(async (req, res) => {
  try {
    let urlPath = req.url === '/' ? '/demo/test-integration.html' : req.url;
    
    // Remove query parameters
    urlPath = urlPath.split('?')[0];
    
    // Security: prevent directory traversal
    if (urlPath.includes('..')) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Forbidden');
      return;
    }

    // Try to serve the requested file
    const filePath = join(__dirname, urlPath);
    const served = await serveFile(filePath, res);
    
    if (served) {
      console.log(`✅ Served: ${urlPath}`);
      return;
    }

    // If file not found, try common alternatives
    const alternatives = [
      join(__dirname, urlPath + '.html'),
      join(__dirname, urlPath + '.js'),
      join(__dirname, urlPath + '.jsx'),
      join(__dirname, 'demo', 'test-integration.html')
    ];

    for (const altPath of alternatives) {
      const served = await serveFile(altPath, res);
      if (served) {
        console.log(`✅ Served alternative: ${altPath}`);
        return;
      }
    }

    // File not found
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          .container { max-width: 600px; margin: 0 auto; }
          .emoji { font-size: 64px; margin-bottom: 20px; }
          a { color: #007AFF; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="emoji">🌸</div>
          <h1>404 - Page Not Found</h1>
          <p>The requested file <code>${urlPath}</code> was not found.</p>
          <p><a href="/">← Back to ZenBloom Demo</a></p>
        </div>
      </body>
      </html>
    `);
    console.log(`❌ Not found: ${urlPath}`);

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`
🌸 ZenBloom Development Server Started!

📱 Mobile App Demo: http://localhost:${PORT}
🧪 Integration Test: http://localhost:${PORT}/demo/test-integration.html
📊 Components Demo: http://localhost:${PORT}/demo/

Server running on port ${PORT}
Press Ctrl+C to stop
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Server terminated');
  server.close(() => {
    process.exit(0);
  });
});
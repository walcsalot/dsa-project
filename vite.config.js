import { defineConfig } from 'vite';
import http from 'http';
import { watch } from 'fs';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: {
      host: 'localhost',
      port: 5173
    },
    watch: {
      // Watch PHP files for changes
      ignored: ['!**/*.php']
    },
    // Proxy API requests to XAMPP
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false
      },
      '/backend/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/backend/, '/Github/dsa-project/backend')
      }
    }
  },
  plugins: [
    tailwindcss(),
    {
      name: 'php-proxy',
      configureServer(server) {
        // Watch PHP files for changes and trigger full page reload
        const watchPhpFiles = () => {
          // Watch index.php
          try {
            const indexPhpPath = resolve(process.cwd(), 'index.php');
            watch(indexPhpPath, { persistent: true }, (eventType) => {
              if (eventType === 'change' && server.ws) {
                console.log(`\n🔄 PHP file changed: index.php - Reloading page...`);
                server.ws.send({
                  type: 'full-reload'
                });
              }
            });
          } catch (err) {
            // File might not exist
          }
          
          // Watch frontend directory for PHP files
          try {
            const frontendPath = resolve(process.cwd(), 'frontend');
            watch(frontendPath, { recursive: true, persistent: true }, (eventType, filename) => {
              if (filename && filename.endsWith('.php') && server.ws) {
                console.log(`\n🔄 PHP file changed: frontend/${filename} - Reloading page...`);
                server.ws.send({
                  type: 'full-reload'
                });
              }
            });
          } catch (err) {
            // Directory might not exist
          }
          
          // Watch backend directory for PHP and JS files
          try {
            const backendPath = resolve(process.cwd(), 'backend');
            watch(backendPath, { recursive: true, persistent: true }, (eventType, filename) => {
              if (filename && (filename.endsWith('.php') || filename.endsWith('.js')) && server.ws) {
                const fileType = filename.endsWith('.php') ? 'PHP' : 'JavaScript';
                console.log(`\n🔄 ${fileType} file changed: backend/${filename} - Reloading page...`);
                server.ws.send({
                  type: 'full-reload'
                });
              }
            });
          } catch (err) {
            // Directory might not exist
          }
        };
        
        // Start watching after server is ready
        server.httpServer?.once('listening', () => {
          watchPhpFiles();
        });
        
        // Handle root, index.php, and all frontend PHP files - proxy to PHP server
        server.middlewares.use((req, res, next) => {
          // Handle root path, index.php, and any PHP files in frontend/
          const isRoot = req.url === '/' || req.url === '/index.php' || req.url.startsWith('/index.php');
          const isFrontendPhp = req.url.startsWith('/frontend/') && req.url.endsWith('.php');
          
          if (isRoot || isFrontendPhp) {
            const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
            
            // Determine the PHP file path
            let phpPath = '/Github/dsa-project/index.php';
            if (isFrontendPhp) {
              phpPath = '/Github/dsa-project' + req.url.split('?')[0];
            }
            
            const options = {
              hostname: 'localhost',
              port: 80,
              path: phpPath + queryString,
              method: req.method,
              headers: {
                ...req.headers,
                host: 'localhost:80'
              }
            };
            
            const proxyReq = http.request(options, (proxyRes) => {
              // Copy response headers but remove content-length for streaming
              const headers = { ...proxyRes.headers };
              delete headers['content-length'];
              
              res.writeHead(proxyRes.statusCode, headers);
              
              proxyRes.on('data', (chunk) => {
                res.write(chunk);
              });
              
              proxyRes.on('end', () => {
                res.end();
              });
            });
            
            proxyReq.on('error', (err) => {
              console.error('PHP Proxy Error:', err.message);
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                  <html>
                    <body>
                      <h1>Error connecting to PHP server</h1>
                      <p>Make sure XAMPP is running on port 80.</p>
                      <p>Error: ${err.message}</p>
                    </body>
                  </html>
                `);
              }
            });
            
            // Forward request body if present
            req.pipe(proxyReq);
            return;
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  root: '.',
  publicDir: 'public'
});

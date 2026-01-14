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
      port: 5173,
      overlay: false // Disable error overlay for smoother experience
    },
    watch: {
      // Watch PHP files for changes
      ignored: ['!**/*.php'],
      // Use polling for better compatibility on Windows
      usePolling: false,
      interval: 100
    },
    // Proxy API requests to XAMPP
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
        timeout: 10000
      },
      '/backend/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
        timeout: 10000,
        rewrite: (path) => path.replace(/^\/backend/, '/Github/dsa-project/backend')
      }
    }
  },
  plugins: [
    tailwindcss(),
    {
      name: 'php-proxy',
      configureServer(server) {
        // Debounce reload to prevent multiple rapid reloads
        let reloadTimeout = null;
        const triggerReload = (filename) => {
          if (reloadTimeout) {
            clearTimeout(reloadTimeout);
          }
          reloadTimeout = setTimeout(() => {
            if (server.ws) {
              console.log(`\n🔄 File changed: ${filename} - Reloading page...`);
              server.ws.send({
                type: 'full-reload',
                path: '*'
              });
            }
          }, 200); // Debounce 200ms
        };
        
        // Watch PHP files for changes and trigger full page reload
        const watchPhpFiles = () => {
          // Watch index.php
          try {
            const indexPhpPath = resolve(process.cwd(), 'index.php');
            watch(indexPhpPath, { persistent: true }, (eventType) => {
              if (eventType === 'change') {
                triggerReload('index.php');
              }
            });
          } catch (err) {
            // File might not exist
          }
          
          // Watch frontend directory for PHP files
          try {
            const frontendPath = resolve(process.cwd(), 'frontend');
            watch(frontendPath, { recursive: true, persistent: true }, (eventType, filename) => {
              if (filename && filename.endsWith('.php')) {
                triggerReload(`frontend/${filename}`);
              }
            });
          } catch (err) {
            // Directory might not exist
          }
          
          // Watch backend directory for PHP and JS files
          try {
            const backendPath = resolve(process.cwd(), 'backend');
            watch(backendPath, { recursive: true, persistent: true }, (eventType, filename) => {
              if (filename && (filename.endsWith('.php') || filename.endsWith('.js'))) {
                triggerReload(`backend/${filename}`);
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
          const isFrontendPhp = req.url.startsWith('/frontend/') && req.url.split('?')[0].endsWith('.php');
          
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
                host: 'localhost:80',
                'Connection': 'keep-alive' // Reuse connections
              },
              timeout: 10000, // 10 second timeout
              agent: false // Create new agent for each request to avoid connection issues
            };
            
            const proxyReq = http.request(options, (proxyRes) => {
              // Copy response headers and optimize for smooth loading
              const headers = { ...proxyRes.headers };
              delete headers['content-length']; // Remove for streaming
              
              // Add cache headers for better performance
              if (!headers['cache-control']) {
                headers['cache-control'] = 'no-cache, no-store, must-revalidate';
              }
              
              res.writeHead(proxyRes.statusCode || 200, headers);
              
              // Collect chunks for faster streaming
              const chunks = [];
              
              proxyRes.on('data', (chunk) => {
                chunks.push(chunk);
                res.write(chunk);
              });
              
              proxyRes.on('end', () => {
                res.end();
              });
              
              proxyRes.on('error', (err) => {
                console.error('PHP Response Error:', err.message);
                if (!res.headersSent) {
                  res.writeHead(500, { 'Content-Type': 'text/html' });
                  res.end('<html><body><h1>Error reading PHP response</h1></body></html>');
                }
              });
            });
            
            // Set timeout for proxy request
            proxyReq.setTimeout(10000, () => {
              proxyReq.destroy();
              if (!res.headersSent) {
                res.writeHead(504, { 'Content-Type': 'text/html' });
                res.end('<html><body><h1>Gateway Timeout</h1><p>PHP server took too long to respond.</p></body></html>');
              }
            });
            
            proxyReq.on('error', (err) => {
              console.error('PHP Proxy Error:', err.message);
              if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`
                  <html>
                    <head>
                      <title>Error</title>
                      <style>
                        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; background: #f5f5f5; }
                        .error-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
                        h1 { color: #dc2626; margin: 0 0 16px; }
                        p { color: #374151; line-height: 1.6; }
                      </style>
                    </head>
                    <body>
                      <div class="error-box">
                        <h1>⚠️ Connection Error</h1>
                        <p><strong>Cannot connect to PHP server.</strong></p>
                        <p>Make sure XAMPP is running on port 80.</p>
                        <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">Error: ${err.message}</p>
                      </div>
                    </body>
                  </html>
                `);
              }
            });
            
            // Forward request body if present
            if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
              req.pipe(proxyReq);
            } else {
              proxyReq.end();
            }
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
    emptyOutDir: true,
    // Optimize for faster builds
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false // Keep console logs for debugging
      }
    }
  },
  root: '.',
  publicDir: 'public',
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['sweetalert2'],
    force: false // Don't force re-optimization on every start
  },
  // Clear screen on updates
  clearScreen: false
});

const fs = require('fs');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..', 'preview');
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 4179);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent((url || '/').split('?')[0]);
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relativePath);
  return target.startsWith(`${root}${path.sep}`) || target === root ? target : null;
}

http
  .createServer((request, response) => {
    const target = resolveRequestPath(request.url);
    if (!target) {
      response.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      response.end('Forbidden');
      return;
    }
    fs.readFile(target, (error, content) => {
      if (error) {
        response.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'content-type': 'text/plain; charset=utf-8' });
        response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error');
        return;
      }
      response.writeHead(200, {
        'cache-control': ['.html', '.css', '.js'].includes(path.extname(target)) ? 'no-cache' : 'public, max-age=3600',
        'content-type': mimeTypes[path.extname(target)] || 'application/octet-stream',
        'x-content-type-options': 'nosniff',
      });
      response.end(content);
    });
  })
  .listen(port, host, () => {
    console.log(`PoemUI site: http://${host}:${port}`);
  });

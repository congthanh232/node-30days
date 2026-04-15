
import http from 'http';

const counter = {};
let reqCount = 0;


const server = http.createServer((req, res) => {
  const { method, url } = req;
  const requestId = ++reqCount;
  const startTime = Date.now();

  // BT3: Đăng ký trước — sẽ tự fire khi res.end() được gọi
  res.on('finish', () => {
    console.log(`[req-${requestId}] ${method} ${url} ${res.statusCode} ${Date.now() - startTime}ms`);
  });

  // tăng counter theo url
  counter[url] = (counter[url] || 0) + 1;

  // routing
  if(method === 'GET' && url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));

    } else if (method === 'POST' && url === '/echo') {

    let body = '';
    //BT4:
    const MAX_BODY_SIZE = 1024;
    const timeout = setTimeout(() => {
        //  trả 408, destroy req
        if (res.writableEnded) return
        res.writeHead(408, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Request timeout'}));
        req.destroy(); 
    }, 5000);

    req.on('data', (chunk) => {
        body += chunk;

        if (body.length > MAX_BODY_SIZE) {
            // Ngắt luôn, không đọc tiếp
            clearTimeout(timeout);
            res.writeHead(413, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Payload too large' }));
            req.destroy(); 
        }
    });
  
    req.on('end', () => {
        clearTimeout(timeout);
        if (res.writableEnded) return;
        const parsed = JSON.parse(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(parsed));
    });
    } else if (method === 'GET' && url === '/metrics') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(counter));
    }

    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
    });


server.listen(3000, () => console.log('Server running on :3000'));
function shutdown() {
  console.log('\nShutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

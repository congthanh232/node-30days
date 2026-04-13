import http from 'http';

const counter = {};
let reqCount = 0;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  const requestId = ++reqCount;
  const startTime = Date.now();

  // Đăng ký trước — sẽ tự fire khi res.end() được gọi
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
  
  req.on('data', (chunk) => {
    body += chunk;
  });
  
  req.on('end', () => {
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
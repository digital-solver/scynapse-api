// Imports
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path')

// Server Setup & URL Management
http.createServer((request, response) => {
  const addr = request.url;
  const q = url.parse(addr, true);
  let filePath = '';

  // Update Log
  fs.appendFile(`${log.txt} URL: ${addr}\nTimestamp: ${new Date()}\n\n`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  // Parse and POST URL
  if (q.pathname.includes('documentation')) {
    filePath = path.join(__dirname, '/documentation.html');
  } else {
    filePath = (__dirname, '/index.html');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text / plain' });
    response.write(data);
    response.end();
  });
}).listen(8080);
console.log('Server: Up\nPort: 8080');

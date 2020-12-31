'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  switch (req.method) {
    case 'GET':
      const fs = require('fs');
      const rs = fs.createReadStream('./form.html');
      rs.pipe(res);
      break;
    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const qs = require('querystring');
        const answer = qs.parse(rawData)
        const content = answer['name'] + 'さんは' + answer['yaki-shabu'] + 'に一票入れました。'
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          content + '</h1></body></html>');
        console.info('[' + now + '] 投稿: ' + answer['name'] + answer['yaki-shabu']);
        res.end();
      });
      break;
    default:
      break;
  }
}).on('error', (e) => {
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
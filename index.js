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
      // res.write('GET ' + req.url);
      const fs = require('fs');
      const rs = fs.createReadStream('./form.html');
      rs.pipe(res);
      break;
    case 'POST':
      res.write('POST ' + req.url);
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        // console.info('[' + now + '] Data posted: ' + rawData);
        const decoded = decodeURIComponent(rawData);
        const qs = require('querystring');
        const answer = qs.parse(decoded);
        const yakiShabu = answer['yaki-shabu'];
        const name = answer['name'];
        console.info(`[${now}] 投稿: ${yakiShabu}`);
        res.write(`<!DOCTYPE html><html lang=\\"ja\\"><body><h1>${name}さんは${yakiShabu}に投稿しました</h1></body></html>`);
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
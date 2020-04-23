'use strict';
const qs = require('querystring');

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
	const answer = qs.parse( decodeURIComponent(rawData) );
	const name = answer['name'];
	const choice = answer['yaki-shabu'];
        console.info('[' + now + '] 投稿：' + '投稿者 => ' + name + ', ' + '選択 => ' + choice);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
		  name + 'は' + choice + 'に投票しました．</h1></body></html>');
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

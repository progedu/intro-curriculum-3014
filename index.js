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
        // POSTで送られたデータ (yaki-shabu=%E7%84%BC%E3%81%8D%E8%82%89&name=%E3%81%AA%E3%81%AA)
        // console.log(rawData);
        // POSTで送られたデータをデコードする (yaki-shabu=焼き肉&name=なな)
        const decoded = decodeURIComponent(rawData);
        // console.log(decoded);
        const qs = require('querystring');
        // デコードしたクエリをオブジェクト形式にする { 'yaki-shabu': '焼き肉', name: 'なな' }
        const answer = qs.parse(decoded);
        // console.log(answer);
        res.write(`<!DOCTYPE html><html lang="ja"><body><h1>
          ${answer['name']}さんが${answer['yaki-shabu']}に投稿しました</h1></body></html>`);
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
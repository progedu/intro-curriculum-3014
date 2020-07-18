'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
  const now = new Date();
  console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  //リクエスト処理
  switch (req.method) {
    //GETの処理
    case 'GET': 
      const fs = require('fs');
      const rs = fs.createReadStream('./form.html');
      //resにファイルをpipe
      rs.pipe(res);
      break;
    //POSTの処理
    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const decoded = decodeURIComponent(rawData);
        const qs = require('querystring');
        const answer = qs.parse(decoded);
        console.info('[' + now + '] 投稿者:' + answer['name'] + ' 回答:' + answer['yaki-shabu']);
        //投稿への返答
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
          answer['name'] + "さんは" + answer['yaki-shabu'] + 'に投票しました</h1></body></html>');
        res.end();
      });
      break;
    default:
      break;
  }
  //エラー処理
}).on('error', (e) => {
  //サーバー側のエラー
  console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
  //クライアント側のエラー
  console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
//8000ポートをlisten
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});
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
        const decoded = decodeURIComponent(rawData);
        const answer = qs.parse(decoded);
        console.info('[' + now + '] 投稿: ' + decoded);

        let message = "";
        switch (answer['kinoko-takenoko']) {
            case 'たけのこの里':
            message = "あなたの味覚は正常です"
            break;
            case 'きのこの山':
            message = "あなたの味覚は危険な状態です"
            break;
            default:
            message = "あなたは決断できない意気地なしです"  
              break;
            }
            res.write(`
                <!DOCTYPE html>
                <html lang="ja">
                  <body>
                    <h1>
                    ${answer['name']} さんが ${answer['kinoko-takenoko']} に投稿しました。<br>
                    ${message}
                    </h1>
                  </body>
                </html>
                `);
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
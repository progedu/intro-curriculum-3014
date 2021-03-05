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
        const decoded = decodeURIComponent(rawData);
        console.info('[' + now + '] 投稿:' + decoded);
       
        let str = decoded.split('&');
        
         let menuitem = str[0].split('=');
        
         let result = menuitem[1];
        //TODO名前を抜き出す
        let nameitem = str[1].split('=');
      
        let usefulname = nameitem[1];



          res.write('<!DOCTYPE html><html lang="ja"><body><h1>' + 
          usefulname + 'が'+ result + 'に投稿しました<h1></body></html>');
          console.log(str);
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
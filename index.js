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
			let body = [];
			req.on('data', (chunk) => {
				body.push(chunk);
			}).on('end', () => {
				body = Buffer.concat(body).toString();
				const decoded = decodeURIComponent(body);
				// decodedから文字列をぬきだす
				// [^\x01-\x7E] 全角の文字の検索 /^[^\x01-\x7E\xA1-\xDF]+$/
				// yaki-shabu=しゃぶしゃぶ&name=太郎が投稿されました
				// 'yaki-shabu=' + 全角文字が1文字以上 + '&name=' + 0文字以上の何でもよい文字列
				// match(/yaki-shabu=([^\x01-\x7E\xA1-\xDF]+)&name=(.*)/i);
				const stringArray = decoded.match(/yaki-shabu=([^\x01-\x7E\xA1-\xDF]+)&name=(.*)/i);
				
				console.info('[' + now + '] 投稿: ' + decoded);

				res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
					  stringArray[2] + 'は、' + stringArray[1] +'が食べたいです。</h1></body></html>');

				// res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
				// 	  decoded + 'が投稿されました</h1></body></html>');
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

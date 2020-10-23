'use strict';
const http = require('http');
const qs = require('querystring');
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
				const returnText = qs.parse(decoded);
				console.info('[' + now + '] 投稿: 名前"' + returnText['name'] + '",解答:"' + returnText['osForm'] + '"');
				res.write('<!DOCTYPE html><html lang="ja"><body><h1> 名前:' +
					  returnText['name'] + '</h1><br><h1> 解答:' + returnText['osForm'] + '</h1> <br> <b>で送信されました</b></body></html>');
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
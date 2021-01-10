'use strict';
const { RSA_NO_PADDING } = require('constants');
const http = require('http');
const server = http.createServer((req, res) => {
	const now = new Date();
	console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
	res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});

	switch (req.method) {
		case 'GET':
			//res.write('GET ' + req.url);
			const fs = require('fs');
			const rs = fs.createReadStream('./form.html');
			rs.pipe(res);
			break;
		case 'POST':
			//res.write('POST ' + req.url);
			//let body = [];
			const qs = require('querystring');
			let rawData = '';
			req.on('data', (chunk) => {
				//body.push(chunk);
				rawData = rawData + chunk;
			}).on('end', () => {
				//body = Buffer.concat(body).toString();
				//console.info('[' + now + '] Data posted: ' + body);
				//const decoded = decodeURIComponent(rawData);
				const answer = qs.parse(rawData);
				const body = `${answer['name']}さんは${answer['yaki-shabu']}に投稿しました。`
				console.info('[' + now + '] ' + body);
				res.write('<!DOCTYPE html><html lang="ja"><body><h1>' + body + '</h1></body></html>');
				res.end();
			});
			break;
		default:
			break;
	}
	//res.end();

}).on('error', (e) => {
	console.error('[' + new Date() + '] Server Error', e);
}).on('clientError', (e) => {
	console.error('[' + new Date() + '] Client Error', e);
});
const port = 8000;
server.listen(port, () => {
	console.info('[' + new Date() + '] Listening on ' + port);
});

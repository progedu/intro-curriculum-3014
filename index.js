'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
	//const qs = require('querystring');
	//const answer = qs.parse('name=吉村&yaki-shabu=しゃぶしゃぶ');
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
				const qs = require('querystring');
				const answer = qs.parse(decoded);
				console.log(answer,decoded);
				//const decoded = decodeURIComponent(body);
				console.info('[' + now + '] 投稿： やきorしゃぶ・' + answer["yaki-shabu"]+" 名前・"+answer["name"]);
				res.write('<!DOCTYPE html><html lang="ja"><body><h1>'+answer["name"]+'さんは' +answer["yaki-shabu"] + 'に投稿しました。</h1></body></html>');
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

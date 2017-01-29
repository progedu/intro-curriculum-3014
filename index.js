'use strict';
const http = require('http');
const server = http.createServer((req, res) => {
	const now = new Date();
	console.info('[' + now + '] Requested by ' + req.connection.remoteAddress);
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'charset': 'utf-8'
	});

	switch (req.method) {
		case 'GET':
			const fs = require('fs');
			const rs = fs.createReadStream('./form.html');
			rs.pipe(res);
			break;
		case 'POST':
			req.on('data', (data) => {
				const decoded = decodeURIComponent(data);
				console.info('[' + now + '] 投稿: ' + decoded);

				if(decoded.slice(-3) === 'らない') {
					res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>絶対許さない！</h1></body></html>')
				}else if(decoded.slice(-1) === '=') {
					res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>絶対許さない！調べて書け！</h1></body></html>')
				}else {
					res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>' + decoded + '<br>回答ありがとうございます。ＷＢＣ王者奪還出来るといいですね。<br>なお監督は小久保ぇ・・・</h1></body></html>');
				}

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

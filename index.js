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
			req.on('data', (data) => {
				const decoded = decodeURIComponent(data);
				console.info('[' + now + '] 投稿: ' + decoded);
				let params = decoded.split('&');
				let paramArray = [];
				for (let i = 0; i < params.length; i++) {
					let param = params[i].split('=');
					paramArray[param[0]] = param[1];
				}
				console.info(paramArray['yaki-shabu']);
				console.info(paramArray['name']);
				res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body>'
					+ "<h1>投稿ありがとうございました</h1>"
					+ "回答: " + paramArray['yaki-shabu'] + "<br>"
					+ "お名前: " + paramArray['name'] + "<br>"
					+ "</body></html>");
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

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
			//pipeがテキストだけだと少しわかりづらかったです。
			//なんとなく例えばどういう状況なのかが少しら理ら理解しづらかった
			//ファイルストリームに対してresを渡してるように見えてなんか気持ち悪い。
			rs.pipe(res);
			break;
		case 'POST':
			req.on('data', (data) => {
				const decoded = decodeURIComponent(data);
				console.info('[' + now + '] 投稿: ' + decoded);
				res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>' +
					decoded + 'が投稿されました</h1></body></html>');
				//decodedを切り分ける方法が知りたいです！後々出てくることを期待してググらないでおきますw
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

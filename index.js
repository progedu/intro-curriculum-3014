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
				const decoded_array = decoded.split("&");
				let tx = {name : '匿名子', yaki_shabu : '秘密'};
				for (let i=0; i<decoded_array.length; i++){
					let data_array = decoded_array[i].split("=");
					switch (data_array[0]){
						case 'name' :
							tx.name = (data_array[1] || tx.name);
							break;
						case 'yaki-shabu':
							tx.yaki_shabu = (data_array[1] || tx.yaki_shabu);
					}
				}
				console.info('[' + now + '] 投稿: ' + decoded);
				res.write('<!DOCTYPE html><html lang="jp"><head><meta charset="utf-8"></head><body><h1>' +
					tx.name+'の食べたいものは、'+
					tx.yaki_shabu + 'であると申告されました</h1></body></html>');
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

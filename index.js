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
			let path = '';
			
			//複数のファイルを読み込ませる!
			switch (req.url)
			{
				case '/':
					res.writeHead(200, {"Content-Type": "text/html"})
					{
						path = './form.html';
						const rs = fs.createReadStream(path,{encoding: "UTF-8"}).pipe(res);
					}
					break;
				case '/style.css':
					//wrteHeadじゃないと読み込まない&拡張子を宣言してあげる必要がある
					res.writeHead(200, {"Content-Type": "text/css"})
					{
						path = './style.css';
						const css = fs.createReadStream(path,{encoding: "UTF-8"}).pipe(res);
					}
					break;
			}
			break;
		case 'POST':
			let body = [];
			req.on('data', (chunk) => {
				body.push(chunk);
			}).on('end', () => {
				body = Buffer.concat(body).toString();
				const decoded = decodeURIComponent(body);
				console.info('[' + now + '] 投稿: ' + decoded);
				//名前の&と=対策
				var result = decoded.split('=');
				if(result.length > 2)
				{
					for(var i = 2; i < result.length; i++)
					{
						result[1] += "=" + result[i];
					}
					//result[2] = result[result.length];
					result.length = 2;
				}

				result = result[1].split('&');
				
				if(result.length > 2)
				{
					for(var i = 0; i < result.length-1; i++)
					{
						result[0] += "&" + result[i];     
					}
					result[1] = result[result.length-1];
					result.length = 2;
				}
				console.info('[' + now + '] result分割: ' + result);
				var name = result[0];

				result = result[1].split('=');

				if(result[1] === "焼き肉")
				{
					console.info('[' + name + '] 焼肉: ' + result);
				}
				else
				{
					console.info('[' + name + '] しゃぶしゃぶ: ' + result);
				}

				res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
					  decoded + 'が投稿されました</h1></body></html>');
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

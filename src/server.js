var WebSocketServer = require('websocket').server;
var http = require('http');
var clients = [];
var idlist = [];
var id = 0;
var array = [];

var server = http.createServer(function (request, response) {
	console.log((new Date()) + ' Received request for ' + request.url);
	if (request.url == '/') {
		url = '/index.html';

	}
	if (request.url == '/favicon.ico') {
		response.writeHead(404);
	}

	response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
	response.end('테스트');
});

server.listen(8000, function () {
	console.log((new Date()) + ' Server is listening on port 8000');
});


webServer = new WebSocketServer(
	{
		httpServer: server,
		autoAcceptConnection: false
	});

function originIsAllowed(origin) {
	return true;
}

webServer.on('request', function (request) {
	if (!originIsAllowed(request.origin)) {
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected');
		return;
	}

	var connection = request.accept(null, request.origin);

	clients.push(connection);
	idlist[request.key] = id++;

	console.log((new Date()) + ' Connection accepted.');
	for (var i = 0; i < array.length; i++) {
		console.log(array[i]);
		connection.sendUTF(array[i]);
	}

	connection.on('message', function (message) {
		if (message.type == 'utf8') {
			console.log('Received Message: ' + message.utf8Data);
			msg = message.utf8Data;
			if (msg.indexOf("move") != -1) {
				if (array.length < 50000) {
					array.push(msg);
				}
				else {
					array.shift();
					array.push(msg);
				}
			} else if (msg.indexOf("refresh") != -1) {
				array = [];
			} else {
			}
			clients.forEach(function (cli) {
				cli.sendUTF(msg);
			});
		}
		else if (message.type == 'binary') {
			console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
		}
	});
	connection.on('close', function (reasonCode, description) {
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});
});

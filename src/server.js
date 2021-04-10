const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = http.createServer(function (request, response) {
	if (request.url == '/favicon.ico') {
		response.writeHead(404);
	}
	response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' , "Access-Control-Allow-Origin": "*"});
});

app.use(cors());

server.listen(8000, function () {
	console.log((new Date()) + ' Server is listening on port 8000');
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'password',
    port : 3306,
	database : 'figle'
});

connection.connect();

connection.query('SELECT * FROM player', (err, row, fields) => {
	if(err) throw err;
	console.log("row:", row.length);
	if(row.length == 0){
	    // 선수 list json 데이터 insert
    }
});

connection.end();

var server = http.createServer(function (request, response) {
	console.log((new Date()) + ' Received request for ' + request.url);

	if (request.url == '/') {
		url = '/index.html';

	}
	if (request.url == '/favicon.ico') {
		response.writeHead(404);
	}
	response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' , "Access-Control-Allow-Origin": "*"});
	response.end('테스트');
});

app.use(cors());

server.listen(8000, function () {
	console.log((new Date()) + ' Server is listening on port 8000');
});
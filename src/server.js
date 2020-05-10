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

app.get('/test', (req, res) => {
	console.log("res-->", res, req);

	connection.query('SELECT * FROM player', (err, row, fields) => {
		if(err) throw err;
		console.log("row:", row.length);

		if(row.length == 0){
			app.get('/fifaonline4/latest/spid.json', (req, res) => {
				console.log("res-->", res);

				let id = req.body.id;
				let name = req.body.name;
				console.log("id:", id, "name:", name);
				console.log("res:", res.length);

				let sql = 'INSERT INTO player (id, name) VALUES (${id}, ${name})';

				// 선수 list json 데이터 insert
				connection.query(sql, (err, result) => {
					if(err) throw err;
					console.log(result.length + "record inserted....");
				})
			});
		}
	});
});

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

app.get('/fifaonline4/latest/spid.json', (req, res) => {
	let id = req.body.id;
	let name = req.body.name;
	console.log("id:", id, "name:", name);
	console.log("res:", res.length);

	let sql = 'INSERT INTO player (id, name) SET (${id}, ${name})';

	// 선수 list json 데이터 insert
	connection.query(sql, (err, results, fields) => {
		if(err) throw err;
		console.log(results.length + "record inserted....");
		res.end(JSON.stringify(results));
	})
});

connection.end();
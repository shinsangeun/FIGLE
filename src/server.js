const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();
const { getNews } = require("./crawl.js");
const cron = require("node-cron");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

async function handleAsync() {
	const sum = await getNews();
	// console.log(sum);
	return sum;
}
cron.schedule("*/1 * * * *", async () => {
	console.log("running a task every two minutes");
	await handleAsync();
});

app.get('/api/crawl', async(req, res) => {
	const text = await handleAsync();
	res.send([
		{ 'id' : 1,
			'text' : text
		}
	]);
});
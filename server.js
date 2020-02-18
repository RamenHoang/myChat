var express = require('express');
var app = express();

var hostname = 'localhost';
var port = 8080;

app.get('/helloWorld', function(req, res) {
	res.send('<h1>Hello World</h1>');
});

app.listen(port, hostname, function() {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

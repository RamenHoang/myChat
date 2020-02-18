import express from 'express';
let app = express();

let hostname = 'localhost';
let port = 8080;

app.get('/helloWorld', (req, res) => {
	res.send('<h1>Hello World</h1>');
});

app.listen(port, hostname, () => {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';

// Init app
let app = express();

// Connect to mongoDB
connectDb();

// Config view engine
configViewEngine(app);

let hostname = process.env.APP_HOSTNAME;
let port = process.env.APP_PORT;

app.get('/', (req, res) => {
	return res.render('main/master');
});

app.get('/login-register', (req, res) => {
	return res.render('auth/loginRegister');
})

app.listen(port, hostname, () => {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

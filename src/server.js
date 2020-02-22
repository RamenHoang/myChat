import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import configSession from './config/session';
import passport from 'passport';

// Init app
let app = express();

// Connect to mongoDB
connectDb();

// Config session
configSession(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Enable flash message
app.use(connectFlash());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

let hostname = process.env.APP_HOSTNAME;
let port = process.env.APP_PORT;

app.listen(port, hostname, () => {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

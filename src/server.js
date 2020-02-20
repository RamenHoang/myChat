import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';

// Init app
let app = express();

// Connect to mongoDB
connectDb();

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Init all routes
initRoutes(app);

let hostname = process.env.APP_HOSTNAME;
let port = process.env.APP_PORT;

app.listen(port, hostname, () => {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

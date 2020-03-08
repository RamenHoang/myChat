import express from 'express';
import connectDb from './config/connectDb';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSockets from './sockets/index';
import cookieParser from 'cookie-parser';
import configSocketio from './config/socketio';
import events from 'events';
import * as configApp from './config/app';

// Init app
let app = express();

// Set max connection event listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listener;

// Init server with socket.io and express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to mongoDB
connectDb();

// Config session
session.config(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Enable flash message
app.use(connectFlash());

// Use cookie parser
app.use(cookieParser());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

// Init all routes
initRoutes(app);

// Config socketio
configSocketio(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);

let hostname = process.env.APP_HOSTNAME;
let port = process.env.APP_PORT;

server.listen(port, hostname, () => {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

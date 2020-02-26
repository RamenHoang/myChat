import session from 'express-session';
import connectMongo from 'connect-mongo';

let mongoStore = connectMongo(session);

let DB_CONNECTION = process.env.DB_CONNECTION;
let DB_HOST 			= process.env.DB_HOST;
let DB_PORT			 	= process.env.DB_PORT;
let DB_NAME 			= process.env.DB_NAME;

/**
 * [sessionStore is where store session]
 * @type {mongodb}
 */
let sessionStore = new mongoStore({
	url: `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
	autoReconnect: true
	// autoRemove: 'native'
});

/**
 * [Config session for app]
 * @param  {[express]} app [from application]
 * @return {[type]}     [description]
 */
let config = (app) => {
	app.use(session({
		key: process.env.SESSION_KEY,
		secret: process.env.SESSION_SECRET,
		store: sessionStore,
		resave: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 // 1 day
		}
	}))
}

module.exports = {
	config: config,
	sessionStore: sessionStore
};

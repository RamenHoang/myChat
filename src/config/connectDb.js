import mongoose from 'mongoose';
import bluebird from 'bluebird';

/**
 * Connect to MongoDB
 * @return {Connecting} [this Connecting is connection to MongoDB]
 */
/**
 * [description]
 * @return {[type]} [description]
 */
let connectDb = () => {
	mongoose.Promise = bluebird;

	let DB_CONNECTION = process.env.DB_CONNECTION;
	let DB_HOST 			= process.env.DB_HOST;
	let DB_PORT			 	= process.env.DB_PORT;
	let DB_NAME 			= process.env.DB_NAME;
	let DB_USERNAME 	= process.env.DB_USERNAME;
	let DB_PASSWORD 	= process.env.DB_PASSWORD;

	let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

	return mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = connectDb;

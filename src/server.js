import express from 'express';
import connectDb from './config/connectDb.js';
import ConntactModel from './models/contact.model.js';

let app = express();
connectDb();

let hostname = process.env.APP_HOSTNAME;
let port = process.env.APP_PORT;

app.get('/testDB', async (req, res) => {
	try {
		let item = {
			userId: '123123',
			contactId: '123213'
		};

		let contact = await ConntactModel.createNew(item);
		res.send(contact);
	} catch(err) {
		console.log(err);
	}
});

app.listen(port, hostname, () => {
	console.log(`Hello Ramen, I'm running at ${hostname}:${port}/`);
});

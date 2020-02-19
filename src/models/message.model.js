import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
	sender: 		{
								id: String,
								username: String,
								avatar: String
							},
	receiver: 	{
								id: String,
								username: String,
								avatar: String
							},
	text: 			String,
	file: 			{data: Buffer, contentType: String, fileName: String},
	createdAt: 	{type: Date, default: Date.now},
	updatedAt: 	{type: Date, default: null},
	deletedAt: 	{type: Date, default: null}
});

module.exports = mongoose.model('message', MessageSchema);

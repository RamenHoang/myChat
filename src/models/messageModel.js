import mongoose from 'mongoose';

let Schema = mongoose.Schema;
const LIMIT_MESSAGE_TAKEN = 10;

let MessageSchema = new Schema({
	senderId: 	String,
	receiverId: String,
	conversasionType: String,
	messageType: String,
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
	createdAt: 	{type: Number, default: Date.now},
	updatedAt: 	{type: Number, default: null},
	deletedAt: 	{type: Number, default: null}
});

const MESSAGE_CONVERSASION_TYPES = {
	PERSONAL: 'personal',
	GROUP: 'group'
};

const MESSAGE_TYPES = {
	TEXT: 'text',
	IMAGE: 'image',
	FILE: 'file'
}

MessageSchema.statics = {
	getMessages(senderId, receiverId) {
		return this.find({
			$or: [
				{
					$and: [
						{'senderId': senderId},
						{'receiverId': receiverId}
					]
				},
				{
					$and: [
						{'senderId': receiverId},
						{'receiverId': senderId}
					]
				}
			]
		}).sort({'createdAt': 1}).limit(LIMIT_MESSAGE_TAKEN).exec();
	}
}

module.exports = {
	model: mongoose.model('message', MessageSchema),
	conversasionTypes: MESSAGE_CONVERSASION_TYPES,
	messageTypes: MESSAGE_TYPES 
}

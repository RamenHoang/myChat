import mongoose from 'mongoose';

let Schema = mongoose.Schema;
const LIMIT_MESSAGE_TAKEN = 30;

let MessageSchema = new Schema({
	senderId: 	String,
	receiverId: String,
	conversationType: String,
	messageType: String,
	sender: 		{
								id: String,
								name: String,
								avatar: String
							},
	receiver: 	{
								id: String,
								name: String,
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
	createNew(item) {
		return this.create(item);
	},
	getMessagesInPersonal(senderId, receiverId) {
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
		}).sort({'createdAt': -1}).limit(LIMIT_MESSAGE_TAKEN).exec();
	},
	getMessagesInGroup(groupId) {
		return this.find({'receiverId': groupId}).sort({'createdAt': -1}).limit(LIMIT_MESSAGE_TAKEN).exec();
	},
	updateSenderAvatarMessage(id, avatar) {
		return this.updateMany(
			{
				'senderId': id
			},
			{
				'sender.avatar': avatar
			}
		).exec();
	},
	updateReceiverAvatarMessage(id, avatar) {
		return this.updateMany(
			{
				'receiverId': id
			},
			{
				'receiver.avatar': avatar
			}
		).exec();
	}
}

module.exports = {
	model: mongoose.model('message', MessageSchema),
	conversationTypes: MESSAGE_CONVERSASION_TYPES,
	messageTypes: MESSAGE_TYPES 
}

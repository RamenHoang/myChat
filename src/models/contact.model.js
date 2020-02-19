import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
	userId: 		String,
	contactId: 	String,
	status: 		{type: Boolean, default: false},
	createdAt: 	{type: Date, default: Date.now},
	updatedAt: 	{type: Date, default: null},
	deletedAt: 	{type: Date, default: null}
});

module.exports = mongoose.model('contact', ContactSchema);

import mongoose from 'mongoose';

const LIMIT_CONVERSASION_TAKEN = 5;
let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
	name: 					String,
	userAmount: 		{type: Number, min: 3, max: 100},
	messageAmount: 	{type: Number, default: 0},
	userId: 				String,
	members: 				[ {userId: String} ],
	createdAt: 			{type: Number, default: Date.now},
	updatedAt: 			{type: Number, default: Date.now},
	deletedAt: 			{type: Number, default: null}
});

ChatGroupSchema.statics = {
	getChatGroups(userId) {
		return this.find({
			'members': {$elemMatch: {'userId': userId}}
		}).sort({'updatedAt': -1}).limit(LIMIT_CONVERSASION_TAKEN).exec();
	},
	createNew(item) {
		return this.create(item);
	}
}

module.exports = mongoose.model('chatGroup', ChatGroupSchema);

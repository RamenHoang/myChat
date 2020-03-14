import mongoose from 'mongoose';

const LIMIT_CONVERSASION_TAKEN = 10;
let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
	name: String,
	userAmount: { type: Number, min: 3, max: 100 },
	messageAmount: { type: Number, default: 0 },
	userId: String,
	members: [
		{
			userId: String,
			username: String,
			avatar: String
		}
	],
	createdAt: { type: Number, default: Date.now },
	updatedAt: { type: Number, default: Date.now },
	deletedAt: { type: Number, default: null }
});

ChatGroupSchema.statics = {
	getChatGroups(userId) {
		return this.find({
			'members': { $elemMatch: { 'userId': userId } }
		}).sort({ 'updatedAt': -1 }).limit(LIMIT_CONVERSASION_TAKEN).exec();
	},
	createNew(item) {
		return this.create(item);
	},
	getChatGroupById(chatGroupId) {
		return this.findById(chatGroupId).exec();
	},
	updateWhenHasNewMessage(chatGroupId, newMessageAmount) {
		return this.findByIdAndUpdate(chatGroupId, { 'messageAmount': newMessageAmount, 'updatedAt': Date.now() }).exec();
	},
	getMoreChatGroups(userId, skip) {
		return this.find({
			'members': { $elemMatch: { 'userId': userId } }
		}).sort({ 'updatedAt': -1 }).skip(skip).limit(LIMIT_CONVERSASION_TAKEN).exec();
	},
	searchGroups(userId, keyword) {
		return this.find({
			$and: [
				{ 'members': { $elemMatch: { 'userId': userId } } },
				{ 'name': { '$regex': new RegExp(keyword, 'i') } }
			]
		}).sort({ 'updatedAt': -1 }).limit(LIMIT_CONVERSASION_TAKEN).exec();
	},
	addMoreMembers(groupId, member) {
		return this.findByIdAndUpdate(groupId, {
			$inc: { userAmount: 1 },
			$push: {
				members: {
					userId: member.memberId,
					username: member.memberUsername,
					avatar: member.memberAvatar
				}
			},
			updatedAt: Date.now()
		}).exec();
	}
}

module.exports = mongoose.model('chatGroup', ChatGroupSchema);

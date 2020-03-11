import mongoose from 'mongoose';
import md5 from 'md5';

let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: 	String,
	gender: 		{type: String, default: 'female'},
	phone: 			{type: String, default: null},
	address: 		{type: String, default: null},
	avatar: 		{type: String, default: 'avatar-default.jpg'},
	role: 			{type: String, default: 'user'},
	local: 			{
								email: 				{ type: String, trim: true },
								password: 		String,
								isActive: 		{ type: Boolean, default: false },
								verifyToken: 	String
							},
	facebook: 	{
								uid: 		String,
								token: 	String,
								email: 	{ type: String, trim: true }
							},
	google: 		{
								uid: 		String,
								token: 	String,
								email: 	{ type: String, trim: true }
							},
	createdAt: 	{ type: Number, default: Date.now },
	updatedAt: 	{ type: Number, default: null },
	deletedAt: 	{ type: Number, default: null }
});

UserSchema.statics = {
	createNew(user) {
		return this.create(user);
	},
	findByEmail(email) {
		return this.findOne({'local.email': email}).exec();
	},
	removeById(id) {
		return this.findByIdAndRemove(id).exec();
	},
	findByToken(token) {
		return this.findOne({ 'local.verifyToken': token }).exec();
	},
	verify(token) {
		return this.findOneAndUpdate(
			{ 'local.verifyToken': token },
			{
				'local.isActive': true,
				'local.verifyToken': null
			}
		).exec();
	},
	findUserById(id) {
		return this.findById(id).exec();
	},
	updateUser(id, item) {
		return this.findByIdAndUpdate(id, item).exec();
	},
	updatePassword(id, password) {
		return this.findByIdAndUpdate(id, {'local.password': password}).exec();
	},
	/**
	 * [findAllForAddContact look up user record which has username === key in user table]
	 * @param  {[array]} beFriendUserIds     [description]
	 * @param  {[string]} keyword [description]
	 * @return {[type]}         [description]
	 */
	findAllForAddContact(beFriendUserIds, keyword) {
		return this.find({
			$and: [
				{ '_id': { $nin: beFriendUserIds } },
				{ 'local.isActive': true },
				{ $or: [
						{ 'username': { '$regex': new RegExp(keyword, 'i') } },
						{ 'local.email': { '$regex': new RegExp(keyword, 'i') } },
						{ 'facebook.email': { '$regex': new RegExp(keyword, 'i') } },
						{ 'google.email': { '$regex': new RegExp(keyword, 'i') } }
					] 
				}
			]
		},
		{
			_id: 1,
			username: 1,
			address: 1,
			avatar: 1
		}).exec();
	},
	getNormalUserDataById(userId) {
		return this.findById(userId, {_id: 1, username: 1, address: 1, avatar: 1}).exec();
	},
	findAllFriends(listFriendIds, keyword) {
		return this.find({
			$and: [
				{ '_id': { $in: listFriendIds } },
				{ 'local.isActive': true },
				{ $or: [
						{ 'username': { '$regex': new RegExp(keyword, 'i') } },
						{ 'local.email': { '$regex': new RegExp(keyword, 'i') } },
						{ 'facebook.email': { '$regex': new RegExp(keyword, 'i') } },
						{ 'google.email': { '$regex': new RegExp(keyword, 'i') } }
					] 
				}
			]
		},
		{
			_id: 1,
			username: 1,
			address: 1,
			avatar: 1
		}).exec();
	}
}

UserSchema.methods = {
	comparePassword(password) {
		return md5(password) === this.local.password;
	}
}

module.exports = mongoose.model('user', UserSchema);

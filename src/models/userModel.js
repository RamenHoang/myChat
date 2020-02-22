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
	createdAt: 	{ type: Date, default: Date.now },
	updatedAt: 	{ type: Date, default: null },
	deletedAt: 	{ type: Date, default: null }
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
	}
}

UserSchema.methods = {
	comparePassword(password) {
		return md5(password) === this.local.password;
	}
}

module.exports = mongoose.model('user', UserSchema);

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

ContactSchema.statics = {
	createNew(item) {
		return this.create(item);
	},
	/**
	 * [findAllByUserId find all id in contact table which is userId's friend]
	 * @param  {[string]} userId [id of current user]
	 * @return {[Promise]}    [this promise resolve all id]
	 */
	findAllByUserId(userId) {
		return this.find({
			$or: [
				{ 'userId': userId },
				{ 'contactId': userId }
			]
		}).exec();
	}
};

module.exports = mongoose.model('contact', ContactSchema);

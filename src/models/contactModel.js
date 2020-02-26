import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
	userId: 		String,
	contactId: 	String,
	status: 		{type: Boolean, default: false},
	createdAt: 	{type: Number, default: Date.now},
	updatedAt: 	{type: Number, default: null},
	deletedAt: 	{type: Number, default: null}
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
	}, 
	/**
	 * [checkExist Check 2 id have relation]
	 * @param  {[type]} userId    [description]
	 * @param  {[type]} contactId [description]
	 * @return {[type]}           [description]
	 */
	checkExist(userId, contactId) {
		return this.findOne({
			$or: [
				{
					$and: [
						{'userId': userId},
						{'contactId': contactId}
					]
				},
				{	
					$and: [
						{'contactId': userId},
						{'userId': contactId}
					]
				}
			]
		}).exec();
	},
	removeRequestContact(userId, contactId) {
		return this.deleteOne({
			$and: [
				{ 'userId': userId },
				{ 'contactId': contactId }
			]
		}).exec();
	}
};

module.exports = mongoose.model('contact', ContactSchema);

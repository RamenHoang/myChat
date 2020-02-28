import mongoose from 'mongoose';

const LIMIT_NUMBER_TAKEN = 10;
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
	},
	getContact(userId) {
		return this.find(
			{
				$and: [
					{
						$or: [
							{'userId': userId},
							{'contactId': userId}
						]
					},
					{'status': true}
				]
			}	
		).sort({'createdAt': -1}).limit(LIMIT_NUMBER_TAKEN).exec();
	},
	getContactSent(userId) {
		return this.find(
			{
				$and: [
					{'userId': userId},
					{'status': false}
				]
			}	
		).sort({'createdAt': -1}).limit(LIMIT_NUMBER_TAKEN).exec();
	},
	getContactReceived(userId) {
		return this.find(
			{
				$and: [
					{'contactId': userId},
					{'status': false}
				]
			}	
		).sort({'createdAt': -1}).limit(LIMIT_NUMBER_TAKEN).exec();
	},
	countAllContactsReceived(userId) {
		return this.countDocuments(
			{
				$and: [
					{'contactId': userId},
					{'status': false}
				]
			}	
		).exec();
	},
	countAllContacts(userId) {
		return this.countDocuments(
			{
				$and: [
					{
						$or: [
							{'userId': userId},
							{'contactId': userId}
						]
					},
					{'status': true}
				]
			}	
		).exec();
	},
	countAllContactsSent(userId) {
		return this.countDocuments(
			{
				$and: [
					{'userId': userId},
					{'status': false}
				]
			}	
		).exec();
	}
};

module.exports = mongoose.model('contact', ContactSchema);

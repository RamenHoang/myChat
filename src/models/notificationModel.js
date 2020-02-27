import mongoose from 'mongoose';

const LIMIT_NUMBER_TAKEN = 7;
let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
	senderId: 	String,
	receiverId: String,
	type: 			String,
	isRead: 		{type: Boolean, default: false},
	createdAt: 	{type: Number, default: Date.now}
});

NotificationSchema.statics = {
	createNew(item) {
		return this.create(item);
	},
	removeRequestContactNotification(senderId, receiverId, type) {
		return this.deleteOne({
			$and: [
				{'senderId': senderId},
				{'receiverId': receiverId},
				{'type': type}
			]
		}).exec();
	},
	/**
	 * Get limit notification to fetch to view
	 * @param {String} userId 
	 * @param {Number} limit 
	 */
	getByUserIdAndLimit(userId) {
		return this.find({
			'receiverId': userId
		}).sort({'createdAt': -1}).limit(LIMIT_NUMBER_TAKEN).exec();
	},
	countUnreaded(currentUserId) {
		return this.countDocuments({
			$and: [
				{'receiverId': currentUserId},
				{'isRead': false}
			]
		}).exec();
	}
	,readMore(userId, skipNumberNotification) {
		return this.find({
			'receiverId': userId
		}).sort({'createdAt': -1}).skip(skipNumberNotification).limit(LIMIT_NUMBER_TAKEN).exec();
	},
	markAsReaded(userId, targetUsers) {
		return this.updateMany(
			{
				$and: [
					{'receiverId': userId},
					{'senderId': {$in: targetUsers}}
				]
			},
			{'isRead': true}	
		).exec();
	}
}

const NOTIFICATION_TYPES = {
	ADD_CONTACT: 'add contact'
}

const NOTIFICATION_CONTENTS = {
	getContent: (userId, username, avatar, notificationType, isRead) => {
		if (notificationType === NOTIFICATION_TYPES.ADD_CONTACT)  {
			if (isRead) {
				return `<div data-uid="${userId}">
									<img class="avatar-small" src="images/users/${avatar}" alt=""> 
									<strong>${username}</strong> đã gửi một lời mời kết bạn!
								</div>`;
			}
			return `<div data-uid="${userId}" class="notif-readed-false">
								<img class="avatar-small" src="images/users/${avatar}" alt=""> 
								<strong>${username}</strong> đã gửi một lời mời kết bạn!
							</div>`;
		}
		return 'No matching with any notification type';
	}
}

module.exports = {
	model: mongoose.model('notification', NotificationSchema),
	types: NOTIFICATION_TYPES,
	contents: NOTIFICATION_CONTENTS
};

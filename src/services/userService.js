import UserModel from '../models/userModel';
import MessageModel from '../models/messageModel';
import { transErrors } from '../../lan/vi';
import md5 from 'md5';

/**
 * [Update user info]
 * @param  {[string]} id   [id of user]
 * @param  {[Object]} d [info is to be updating]
 * @return {[type]}      [description]
 */
let updateUser = async (id, d) => {
	// Update avatar in message collection
	await MessageModel.model.updateSenderAvatarMessage(id, d.avatar);
	await MessageModel.model.updateReceiverAvatarMessage(id, d.avatar);

	return UserModel.updateUser(id, d);
}

let updatePassword = (id, data) => {
	return new Promise(async (resolve, reject) => {
		let currentUser = await UserModel.findUserById(id);
		if (!currentUser) {
			return reject(transErrors.account_undefined);
		}

		let checkCurrentPassword = currentUser.comparePassword(data.currentPassword);
		if (!checkCurrentPassword) {
			return reject(transErrors.current_password_not_match);
		}

		await UserModel.updatePassword(id, md5(data.newPassword));
		resolve(true);
	});
}

module.exports = {
	updateUser: updateUser,
	updatePassword: updatePassword
}

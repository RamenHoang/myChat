import UserModel from '../models/userModel';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';
import { transErrors, transSuccess } from '../../lan/vi';

let register = (email, gender, password) => {
	return new Promise(async (resolve, reject) => {
		let userByEmail = await UserModel.findByEmail(email);
		// Check if email is used?
		if (userByEmail) {
			// Check if account is removed?
			if (userByEmail.deleteAt != null) {
				return reject(transErrors.email_is_removed);
			}
			// Check if account is actived?
			if (userByEmail.local.isActive === false) {
				return reject(transErrors.email_is_not_actived(email));
			}
			return reject(transErrors.email_in_use);
		} 
		// If not be used
		let userItem = {
			username: email.split('@')[0],
			gender: gender,
			local: {
				email: email,
				password: md5(password),
				verifyToken: uuidv4()
			}
		}

		if (await UserModel.createNew(userItem) != null) {
			return resolve(transSuccess.register_success(email));
		};
	});
}

module.exports = {
	register: register 
}

import UserModel from '../models/userModel';
import md5 from 'md5';
import uuidv4 from 'uuid/v4';
import { transErrors, transSuccess, transMail } from '../../lan/vi';
import sendMail from '../config/mailer';

let register = (email, gender, password, protocol, host) => {
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

		let user = await UserModel.createNew(userItem);
		if (user != null) {
			// Send activitation mail
			let verifyLink = `${protocol}://${host}/verify/${userItem.local.verifyToken}`;
			sendMail(email, transMail.subject, transMail.template(verifyLink))
				.then(success => {
					resolve(transSuccess.register_success(email));
				})
				.catch(async error => {
					// Remove user
					await UserModel.removeById(user._id)
					console.log(error);
					reject(transMail.send_failed);
				})
		};
	});
}

let verifyAccount = (token) => {
	return new Promise(async (resolve, reject) => {
		if (await UserModel.findByToken(token) === null) {
			return reject(transErrors.email_is_actived);
		}
		await UserModel.verify(token);
		resolve(transSuccess.account_actived);
	});
}

module.exports = {
	register: register,
	verifyAccount: verifyAccount
}

import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';

let findUsersContact = (currentUserId, keyword) => {
	return new Promise(async (resolve, reject) => {
		let beFriendUserIds = [];
		let contactsByUser = await ContactModel.findAllByUserId(currentUserId);
		contactsByUser.forEach((contact) => {
			beFriendUserIds.push(contact.userId);
			beFriendUserIds.push(contact.contactId);
		});

		// make Ids is unique
		beFriendUserIds = beFriendUserIds.filter((cur, index, arr) => {
			if (arr.indexOf(cur, index + 1) === -1) return true;
			return false;
		});

		let users = await UserModel.findAllForAddContact(beFriendUserIds, keyword);
		resolve(users);
	});
}

module.exports = {
	findUsersContact: findUsersContact
}


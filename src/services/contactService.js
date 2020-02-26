import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';

let findUsersContact = (currentUserId, keyword) => {
	return new Promise(async (resolve, reject) => {
		let beFriendUserIds = [ currentUserId ];
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

let addNew = (currentUserId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let contactExist = await ContactModel.checkExist(currentUserId, contactId);
		if (contactExist) {
			return reject(false);
		}

		let newContactItem = {
			userId: currentUserId,
			contactId: contactId
		}

		let newContact = await ContactModel.createNew(newContactItem);
		resolve(newContact);
	});
}

let removeRequestContact = (userId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let contactExist = await ContactModel.checkExist(userId, contactId);
		if (!contactExist) {
			return reject(false);
		}

		let removeStatus = await ContactModel.removeRequestContact(userId, contactId);
		resolve(removeStatus.n);
	});
}

module.exports = {
	findUsersContact: findUsersContact,
	addNew: addNew,
	removeRequestContact: removeRequestContact
}


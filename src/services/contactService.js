import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import NotifictionModel from '../models/notificationModel';

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
		// create contact
		let newContactItem = {
			userId: currentUserId,
			contactId: contactId
		}

		let newContact = await ContactModel.createNew(newContactItem);

		// create notification
		let notificationItem = {
			senderId: currentUserId,
			receiverId: contactId,
			type: NotifictionModel.types.ADD_CONTACT
		}

		await NotifictionModel.model.createNew(notificationItem);
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

		// Remove notification
		await NotifictionModel.model.removeRequestContactNotification(userId, contactId, NotifictionModel.types.ADD_CONTACT);
		resolve(removeStatus.n);
	});
}

let getContact = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContactModel.getContact(userId);
			contacts = contacts.map(async (contact) => {
				if (contact.contactId == userId)
					return await UserModel.findUserById(contact.userId);
				return await UserModel.findUserById(contact.contactId);
			});

			resolve(await Promise.all(contacts));
		} catch (error) {
			console.log('Get contact error: ', error);
			reject(error)
		}
	});
}

let getContactSent = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContactModel.getContactSent(userId);
			contacts = contacts.map(async (contact) => {
				return await UserModel.findUserById(contact.contactId);
			});

			resolve(await Promise.all(contacts));
		} catch (error) {
			console.log('Get contact sent error: ', error);
			reject(error)
		}
	});
}

let getContactReceived = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContactModel.getContactReceived(userId);
			contacts = contacts.map(async (contact) => {
				return await UserModel.findUserById(contact.userId);
			});

			resolve(await Promise.all(contacts));
		} catch (error) {
			console.log('Get contact received error: ', error);
			reject(error)
		}
	});
}

let countAllContacts = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			resolve(await ContactModel.countAllContacts(userId));
		} catch (error) {
			reject(error);
		}
	});
}
let countAllContactsSent = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			resolve(await ContactModel.countAllContactsSent(userId));
		} catch (error) {
			reject(error);
		}
	});
}
let countAllContactsReceived = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			resolve(await ContactModel.countAllContactsReceived(userId));
		} catch (error) {
			reject(error);
		}
	});
}


module.exports = {
	findUsersContact: findUsersContact,
	addNew: addNew,
	removeRequestContact: removeRequestContact,
	getContact: getContact,
	getContactSent: getContactSent,
	getContactReceived: getContactReceived,
	countAllContactsReceived: countAllContactsReceived,
	countAllContacts: countAllContacts,
	countAllContactsSent: countAllContactsSent
}


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

let removeRequestContactSent = (userId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let contactExist = await ContactModel.checkExist(userId, contactId);
		if (!contactExist) {
			return reject(false);
		}

		let removeStatus = await ContactModel.removeRequestContactSent(userId, contactId);

		// Remove notification
		await NotifictionModel.model.removeRequestContactSentNotification(userId, contactId, NotifictionModel.types.ADD_CONTACT);
		resolve(removeStatus.n);
	});
}

let removeRequestContactReceived = (userId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let contactExist = await ContactModel.checkExist(userId, contactId);
		if (!contactExist) {
			return reject(false);
		}

		let removeStatus = await ContactModel.removeRequestContactReceived(userId, contactId);

		// Remove notification
		await NotifictionModel.model.removeRequestContactReceivedNotification(contactId, userId, NotifictionModel.types.ADD_CONTACT);
		resolve(removeStatus.n);
	});
}

let getContact = (userId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContactModel.getContact(userId);
			contacts = contacts.map(async (contact) => {
				if (contact.contactId == userId)
					return await UserModel.getNormalUserDataById(contact.userId);
				return await UserModel.getNormalUserDataById(contact.contactId);
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
				return await UserModel.getNormalUserDataById(contact.contactId);
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
				return await UserModel.getNormalUserDataById(contact.userId);
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

let readMoreContact = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			let newContacts = await ContactModel.readMoreContact(userId, skip);
			newContacts = newContacts.map(async (contact) => {
				if (userId == contact.contactId) {
					return await UserModel.getNormalUserDataById(contact.userId);
				}
				return await UserModel.getNormalUserDataById(contact.contactId);
			});

			resolve(await Promise.all(newContacts));
		} catch (error) {
			reject(error);
		}
	});
}
let readMoreContactSent = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			let newContacts = await ContactModel.readMoreContactSent(userId, skip);
			
			console.log(newContacts);

			newContacts = newContacts.map(async (contact) => {
				return await UserModel.getNormalUserDataById(contact.contactId);
			});

			resolve(await Promise.all(newContacts));
		} catch (error) {
			reject(error);
		}
	});
}
let readMoreContactReceived = (userId, skip) => {
	return new Promise(async (resolve, reject) => {
		try {
			let newContacts = await ContactModel.readMoreContactReceived(userId, skip);

			newContacts = newContacts.map(async (contact) => {
				return await UserModel.getNormalUserDataById(contact.userId);
			});

			resolve(await Promise.all(newContacts));
		} catch (error) {
			reject(error);
		}
	});
}

let acceptRequestContact = (userId, contactId) => {
	return new Promise(async (resolve, reject) => {
		try {
			await ContactModel.acceptRequestContact(userId, contactId);
			// create notification
			let notificationItem = {
				senderId: userId,
				receiverId: contactId,
				type: NotifictionModel.types.ACCEPT_CONTACT
			}

			await NotifictionModel.model.createNew(notificationItem);
			resolve(true);
		} catch (error) {
			console.log('Accept Error:', error);
			reject(error);
		}
	});
}

let removeContact = (userId, contactId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let deleteStatus = await ContactModel.removeContact(userId, contactId);
			resolve(deleteStatus);
		} catch (error) {
			console.log('Remove contact error: ', error);
			reject(error);
		}
	});
}

let searchFriends = (currentUserId, keyword) => {
	return new Promise(async (resolve, reject) => {
		let friendUserIds = [];
		let contactsByUser = await ContactModel.findFriendsByUserId(currentUserId);
		contactsByUser.forEach((contact) => {
			friendUserIds.push(contact.userId);
			friendUserIds.push(contact.contactId);
		});

		// make Ids is unique
		friendUserIds = friendUserIds.filter((cur, index, arr) => {
			if (cur == currentUserId) {
				return false;
			}
			if (arr.indexOf(cur, index + 1) === -1) return true;
			return false;
		});

		let users = await UserModel.findAllFriends(friendUserIds, keyword);
		resolve(users);
	});
}

module.exports = {
	findUsersContact: findUsersContact,
	addNew: addNew,
	removeRequestContactSent: removeRequestContactSent,
	removeRequestContactReceived: removeRequestContactReceived,
	getContact: getContact,
	getContactSent: getContactSent,
	getContactReceived: getContactReceived,
	countAllContacts: countAllContacts,
	countAllContactsSent: countAllContactsSent,
	countAllContactsReceived: countAllContactsReceived,
	readMoreContact: readMoreContact,
	readMoreContactSent: readMoreContactSent,
	readMoreContactReceived: readMoreContactReceived,
	acceptRequestContact: acceptRequestContact,
	removeContact: removeContact,
	searchFriends: searchFriends
}


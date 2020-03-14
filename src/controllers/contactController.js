import { contact, message, groupChat } from '../services/services';
import { validationResult } from 'express-validator/check';

let findUsersContact = async (req, res) => {
	let errors = [];
	let validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		errors = Object.values(validationErrors.mapped()).map((error) => error.msg);
		return res.status(500).send(errors);
	}
	try {
		let currentUserId = req.user._id;
		let keyword = req.params.keyword;

		let users = await contact.findUsersContact(currentUserId, keyword);
		return res.render('main/contact/sections/_findUserAddContact', { users })
	} catch (error) {
		return res.status(500).send(error);
	}
}

let addNew = async (req, res) => {
	try {
		let currentUserId = req.user._id;
		let contactId = req.body.uid;

		let newContact = await contact.addNew(currentUserId, contactId);

		return res.status(200).send({ success: !!newContact });
	} catch (error) {
		return res.status(500).send(error);
	}
}

let removeRequestContactSent = async (req, res) => {
	try {
		let currentUserId = req.user._id;
		let contactId = req.body.uid;

		let deleteStatus = await contact.removeRequestContactSent(currentUserId, contactId);

		return res.status(200).send({ success: !!deleteStatus });
	} catch (error) {
		res.status(500).send(error);
	}
}

let removeRequestContactReceived = async (req, res) => {
	try {
		let currentUserId = req.user._id;
		let contactId = req.body.uid;

		let deleteStatus = await contact.removeRequestContactReceived(currentUserId, contactId);

		return res.status(200).send({ success: !!deleteStatus });
	} catch (error) {
		res.status(500).send(error);
	}
}

let readMoreContact = async (req, res) => {
	try {
		let skip = parseInt(req.query.skipNumber, 10);
		if (!skip) skip = 0;
		let newContacts = await contact.readMoreContact(req.user._id, skip);
		res.status(200).send(newContacts);
	} catch (error) {
		res.status(500).send(error);
	}
}

let readMoreContactSent = async (req, res) => {
	try {
		let skip = parseInt(req.query.skipNumber, 10);
		if (!skip) skip = 0;
		let newContacts = await contact.readMoreContactSent(req.user._id, skip);
		res.status(200).send(newContacts);
	} catch (error) {
		res.status(500).send(error);
	}
}

let readMoreContactReceived = async (req, res) => {
	try {
		let skip = parseInt(req.query.skipNumber, 10);
		if (!skip) skip = 0;
		let newContacts = await contact.readMoreContactReceived(req.user._id, skip);

		res.status(200).send(newContacts);
	} catch (error) {
		res.status(500).send(error);
	}
}

let acceptRequestContact = async (req, res) => {
	try {
		let acceptedData = await contact.acceptRequestContact(req.user._id, req.body.uid);
		res.status(200).send(acceptedData);
	} catch (error) {
		res.status(500).send(error);
	}
}

let removeContact = async (req, res) => {
	try {
		let deleteStatus = await contact.removeContact(req.user._id, req.body.uid);
		await message.removeMessage(req.user._id, req.body.uid);
		if (deleteStatus.n) {
			res.status(200).send({ success: true });
		} else {
			console.log('error from removeContact at Controller');
		}
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
}

let searchFriends = async (req, res) => {
	let errors = [];
	let validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		errors = Object.values(validationErrors.mapped()).map((error) => error.msg);
		return res.status(500).send(errors);
	}
	try {
		let currentUserId = req.user._id;
		let keyword = req.params.keyword;

		let users = await contact.searchFriends(currentUserId, keyword);
		return res.render('main/groupChat/sections/_searchFriends', { users })
	} catch (error) {
		return res.status(500).send(error);
	}
}

let findConversations = async (req, res) => {
	let errors = [];
	let validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		errors = Object.values(validationErrors.mapped()).map((error) => error.msg);
		return res.status(500).send(errors);
	}
	try {
		let userId = req.user._id;
		let keyword = req.params.keyword;

		let users = contact.searchFriends(userId, keyword);
		let groups = groupChat.searchGroups(userId, keyword);
		let personalConversations = await users;
		let groupConversations = await groups;

		let conversations = personalConversations.concat(groupConversations);

		return res.render('main/searchConversations/_searchConversations', { conversations });
	} catch (error) {
		console.log('controller:', error);
		return res.status(500).send(error);
	}
}

let searchMoreFriends = async (req, res) => {
	let errors = [];
	let validationErrors = validationResult(req);
	if (!validationErrors.isEmpty()) {
		errors = Object.values(validationErrors.mapped()).map((error) => error.msg);
		return res.status(500).send(errors);
	}
	try {
		let currentUserId = req.user._id;
		let keyword = req.params.keyword;
		let memberIds = req.query.memberIds.split(',');

		let users = await contact.searchMoreFriends(currentUserId, keyword, memberIds);
		return res.render('main/groupChat/sections/_searchFriends', { users })
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}
}

module.exports = {
	findUsersContact: findUsersContact,
	addNew: addNew,
	removeRequestContactSent: removeRequestContactSent,
	removeRequestContactReceived: removeRequestContactReceived,
	readMoreContact: readMoreContact,
	readMoreContactSent: readMoreContactSent,
	readMoreContactReceived: readMoreContactReceived,
	acceptRequestContact: acceptRequestContact,
	removeContact: removeContact,
	searchFriends: searchFriends,
	findConversations: findConversations,
	searchMoreFriends: searchMoreFriends
}

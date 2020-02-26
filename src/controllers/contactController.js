import { contact } from '../services/services';
import { validationResult } from 'express-validator/check';

let findUsersContact =  async (req, res) => {
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
		return res.render('main/contact/sections/_findUserAddContact', {users})
	} catch(error) {
		return res.status(500).send(error);
	}
}

let addNew = async (req, res) => {
	try {
		let currentUserId = req.user._id;
		let contactId = req.body.uid;

		let newContact = await contact.addNew(currentUserId, contactId);

		return res.status(200).send({success: !!newContact});
	} catch(error) {
		return res.status(500).send(error);
	}
}

let removeRequestContact = async (req, res) => {
	try {
		let currentUserId = req.user._id;
		let contactId = req.body.uid;

		let deleteStatus = await contact.removeRequestContact(currentUserId, contactId);

		return res.status(200).send({ success: !!deleteStatus });
	} catch(error) {
		res.status(500).send(error);
	}
}

module.exports = {
	findUsersContact: findUsersContact,
	addNew: addNew,
	removeRequestContact: removeRequestContact
}

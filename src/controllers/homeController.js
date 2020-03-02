import { notification, contact, message } from '../services/services';

let getHome = async (req, res) => {
	// Only 10 notifications
	let notifications = await notification.getNotifications(req.user._id);
	// Get all unreaded notification
	let countUnreadedNotifications = await notification.countUnreaded(req.user._id);

	// Get contacts 10 item 
	let contacts = await contact.getContact(req.user._id);
	// Get contacts sent
	let contactsSent = await contact.getContactSent(req.user._id);
	// Get contacts received
	let contactsReceived = await contact.getContactReceived(req.user._id);

	// Count contacts
	let countAllContacts = await contact.countAllContacts(req.user._id);
	let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
	let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);


	let getAllConversasionItems = await message.getAllConversasionItems(req.user._id);

	return res.render('main/home/home', {
		success: req.flash('success'),
		errors: req.flash('errors'),
		user: req.user,
		notifications: notifications,
		countUnreadedNotifications: countUnreadedNotifications,
		contacts: contacts,
		contactsSent: contactsSent,
		contactsReceived: contactsReceived,
		countAllContactsReceived: countAllContactsReceived,
		countAllContacts: countAllContacts,
		countAllContactsSent: countAllContactsSent,
		userConversasions: getAllConversasionItems.userConversasions,
		groupConversations: getAllConversasionItems.groupConversations,
		allConversasions: getAllConversasionItems.allConversasions
	});
}

module.exports = {
	getHome: getHome
};

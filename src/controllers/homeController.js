import { notification, contact, message } from '../services/services';
import { bufferToBase64, getLastMessage, getDuration } from '../helpers/clientHelper';
import request from 'request';

let getICETurnServer = () => {
	return new Promise(async (resolve, reject) => {
		let o = {
			format: "urls"
		};

		let bodyString = JSON.stringify(o);
		
		let options = {
			url: 'https://global.xirsys.net/_turn/myChat',
			// host: "global.xirsys.net",
			// path: "/_turn/myChat",
			method: "PUT",
			headers: {
				"Authorization": "Basic " + Buffer.from("anhnguyenhoang:c0e42b52-6149-11ea-8d87-0242ac110004").toString("base64"),
				"Content-Type": "application/json",
				"Content-Length": bodyString.length
			}
		};

		// Call a request to getICETurnServer
		request(options, (error, response, body) => {
			if (error) {
				console.log('error when get ice', error);
				return reject(error);
			}
			let bodyJson = JSON.parse(body);
			resolve(bodyJson.v.iceServers);
		});
	});
}

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


	let getAllConversations = await message.getAllConversations(req.user._id);

	// Get ICE List Turn Server from xirsys
	let iceServerList = await getICETurnServer();

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
		allconversationWithMessages: getAllConversations.allconversationWithMessages,
		bufferToBase64: bufferToBase64,
		getLastMessage: getLastMessage,
		getDuration: getDuration,
		iceServerList: JSON.stringify(iceServerList)
	});
}

module.exports = {
	getHome: getHome
};

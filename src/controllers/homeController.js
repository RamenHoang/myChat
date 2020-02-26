import { notification } from '../services/services';

let getHome = async (req, res) => {
	// Only 10 notifications
	let notifications = await notification.getNotifications(req.user._id);
	// Get all unreaded notification
	let countUnreadedNotifications = await notification.countUnreaded(req.user._id);

	return res.render('main/home/home', {
		success: req.flash('success'),
		errors: req.flash('errors'),
		user: req.user,
		notifications: notifications,
		countUnreadedNotifications: countUnreadedNotifications
	});
}

module.exports = {
	getHome: getHome
};

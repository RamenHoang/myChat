import { notification } from '../services/services';

let getHome = async (req, res) => {
	let notifications = await notification.getNotifications(req.user._id);

	return res.render('main/home/home', {
		success: req.flash('success'),
		errors: req.flash('errors'),
		user: req.user,
		notifications: notifications
	});
}

module.exports = {
	getHome: getHome
};

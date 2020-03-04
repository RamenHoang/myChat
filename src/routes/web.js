import express from 'express';
import { home, auth, user, contact, notification, message } from './../controllers/controllers';
import { authValid, userValid, contactValid, messageValid } from './../validation/validators';
import initPassportLocal from '../controllers/passportController/local';
import passport from 'passport';

// Init all passport
initPassportLocal();

let router = express.Router();

/**
 * Init all routes
 * @param {express} [app] [from express module]
 * @return {[type]} [description]
 */
let initRoutes = (app) => {
	router.get('/', authValid.checkLoggedIn, home.getHome);
	router.get('/login-register', authValid.checkLoggedOut, auth.getLoginRegister);
	router.get('/logout', authValid.checkLoggedIn, auth.getLogout);
	router.get('/verify/:token', authValid.checkLoggedOut, auth.getVerifyAccount);

	router.post('/register', authValid.checkLoggedOut, authValid.register, auth.postRegister);
	router.post('/login', authValid.checkLoggedOut, passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login-register',
		successFlash: true,
		failureFlash: true
	}));

	router.put('/user/update-avatar', authValid.checkLoggedIn, user.updateAvatar);
	router.put('/user/update-info', authValid.checkLoggedIn, userValid.updateInfo, user.updateInfo);
	router.put('/user/update-password', userValid.updatePassword, user.updatePassword);

	router.get('/contact/find-users/:keyword', authValid.checkLoggedIn, contactValid.findUserContact, contact.findUsersContact);
	router.post('/contact/add-new', authValid.checkLoggedIn, contact.addNew);
	router.delete('/contact/remove-request-contact-sent', authValid.checkLoggedIn, contact.removeRequestContactSent);
	router.delete('/contact/remove-request-contact-received', authValid.checkLoggedIn, contact.removeRequestContactReceived);
	router.get('/contact/read-more-contact', authValid.checkLoggedIn, contact.readMoreContact);
	router.get('/contact/read-more-contact-sent', authValid.checkLoggedIn, contact.readMoreContactSent);
	router.get('/contact/read-more-contact-received', authValid.checkLoggedIn, contact.readMoreContactReceived);
	router.put('/contact/accept-request-contact',authValid.checkLoggedIn, contact.acceptRequestContact);
	router.delete('/contact/remove-contact', authValid.checkLoggedIn, contact.removeContact);

	router.get('/notification/read-more', authValid.checkLoggedIn, notification.readMore);
	router.put('/notification/mark-as-readed', authValid.checkLoggedIn, notification.markAsReaded);

	router.post('/message/add-new-text-emoji', authValid.checkLoggedIn, messageValid.checkMessageLength, message.addNewTextEmoji);

	app.use('/', router);
}

module.exports = initRoutes;

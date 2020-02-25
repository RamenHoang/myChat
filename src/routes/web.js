import express from 'express';
import { home, auth, user } from './../controllers/controllers';
import { authValid, userValid } from './../validation/validators';
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

	app.use('/', router);
}

module.exports = initRoutes;

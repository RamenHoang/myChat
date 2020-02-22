import express from 'express';
import { home, auth } from './../controllers/controllers';
import { authValid } from './../validation/validators';
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
	router.get('/', home.getHome);
	router.get('/login-register', auth.getLoginRegister);
	router.get('/logout', auth.getLogout);
	router.get('/verify/:token', auth.getVerifyAccount);

	router.post('/register', authValid.register, auth.postRegister);
	router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login-register',
		successFlash: true,
		failureFlash: true
	}));
	app.use('/', router);
}

module.exports = initRoutes;

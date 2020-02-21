import express from 'express';
import { home, auth } from './../controllers/controllers';
import { authValid } from './../validation/validators';

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
	router.post('/register', authValid.register, auth.postRegister);
	app.use('/', router);
}

module.exports = initRoutes;

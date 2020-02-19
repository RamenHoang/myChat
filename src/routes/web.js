import express from 'express';
import { home, auth } from './../controllers/controllers';

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

	app.use('/', router);
}

module.exports = initRoutes;

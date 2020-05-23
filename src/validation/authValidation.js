import { check } from 'express-validator/check';
import { transValidation } from '../../lan/vi';

let register = [
	check('email', transValidation.email_incorrect)
		.isEmail()
		.trim(),
	check('gender', transValidation.gender_incorrect)
		.isIn(['male', 'female']),
	check('password', transValidation.password_incorrect)
		.isLength({min: 8})
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/),
	check('password_confirmation', transValidation.password_confirmation_incorrect)
		.custom((value, {req}) => {
			return value === req.body.password;
		})
];

let checkLoggedIn = (req, res, next) => {
	console.log(req.session);
	if (!req.isAuthenticated()) {
		return res.redirect('/login-register');
	}
	next();
}

let checkLoggedOut = (req, res, next) => {
	if (req.isAuthenticated()) {
		return res.redirect('/');
	}
	next();
}

module.exports = {
	register: register,
	checkLoggedIn: checkLoggedIn,
	checkLoggedOut: checkLoggedOut
}

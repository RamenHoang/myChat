import { validationResult } from 'express-validator/check';
import { auth } from '../services/services';

let getLoginRegister = (req, res) => {
	return res.render('auth/master', {
		errors: req.flash('errors'),
		success: req.flash('success')
	});
}

let postRegister = async (req, res) => {
	let result = validationResult(req);
	let errors = [];
	let success = [];

	// Having errors
	if (!result.isEmpty()) {
		errors = Object.values(result.mapped()).map((errorObj) => {
			return errorObj.msg;
		});

		// Show errors
		req.flash('errors', errors);
		return res.redirect('/login-register');
	}

	// Succeed
	await auth.register(req.body.email, req.body.gender, req.body.password)
		.then((message = '') => {
			if (message === '') return;
			success.push(message);
			req.flash('success', success);
			return res.redirect('/login-register');
		})
		.catch((error = '') => {
			if (error === '') return;
			errors.push(error);
			req.flash('errors', errors);
			return res.redirect('/login-register');
		})
}

let getLogout = (req, res) => {
	// do sth
}

module.exports = {
	getLoginRegister: getLoginRegister,
	getLogout: getLogout,
	postRegister: postRegister
};

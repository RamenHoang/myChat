import {validationResult} from 'express-validator/check';

let getLoginRegister = (req, res) => {
	return res.render('auth/loginRegister');
}

let postRegister = (req, res) => {
	let result = validationResult(req);
	let errors = [];
	if (!result.isEmpty()) {
		errors = Object.values(result.mapped()).map((errorObj) => {
			return errorObj.msg;
		});

		// Show errors
		return;
	}
}

let getLogout = (req, res) => {
	// do sth
}

module.exports = {
	getLoginRegister: getLoginRegister,
	getLogout: getLogout,
	postRegister: postRegister
};

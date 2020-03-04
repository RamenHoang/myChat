import passport from 'passport';
import passportLocal from 'passport-local';
import UserModel from '../../models/userModel';
import ChatGroupModel from '../../models/chatGroupModel';
import { transErrors, transSuccess } from '../../../lan/vi'; 

let localStrategy = passportLocal.Strategy;


let initPassportLocal = () => {
	passport.use(new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, async (req, email, password, done) => {
		try {
			let user = await UserModel.findByEmail(email);
			if (!user) {
				return done(null, false, req.flash('errors', transErrors.login_failed));
			}
			if (!user.local.isActive) {
				return done(null, false, req.flash('errors', transErrors.email_is_not_actived(email)));
			}
			if (!user.comparePassword(password)) {
				return done(null, false, req.flash('errors', transErrors.login_failed));
			}
			return done(null, user, req.flash('success', transSuccess.login_success(user.username)));
		} catch(error) {
			console.log(error);
			return done(null, false, req.flash('errors', transErrors.server_error))
		}
	}));

	// Save user id to session
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((id, done) => {
		UserModel.findUserById(id)
			.then(async user => {
				user.local.password = '';
				user.chatGroups = await ChatGroupModel.getChatGroups(user._id);
				return done(null, user);
			})
			.catch(error => {
				return done(error, null);
			});
	});
}

module.exports = initPassportLocal;

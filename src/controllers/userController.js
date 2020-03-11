import multer from 'multer';
import { app } from '../config/app';
import { transErrors, transSuccess } from '../../lan/vi';
import uuidv4 from 'uuid/v4';
import { user } from '../services/services';
import fsExtra from 'fs-extra';
import { validationResult } from 'express-validator/check';

let storageAvatar = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, app.avatar_directory);
	},
	filename: (req, file, callback) => {
		let match = app.avatar_type;
		if (match.indexOf(file.mimetype) === -1) {
			return callback(transErrors.avatar_type, null);
		}

		let avatar_name = `${Date.now()}-${uuidv4()}-${file.originalname}`;
		callback(null, avatar_name);
	}
});

let avatarUploadFile = multer({
	storage: storageAvatar,
	limits: { fileSize: app.avatar_limit_size }
}).single('avatar');

let updateAvatar = (req, res) => {
	avatarUploadFile(req, res, async (error) => {
		if (error) {
			if (error.message) {
				return res.status(500).send(transErrors.avatar_size);
			}
			return res.status(500).send(error);
		}
		
		try {
			let updateUserItem = {
				avatar: req.file.filename,
				updatedAt: Date.now()
			}
			// Update user
			let userUpdate = await user.updateUser(req.user._id, updateUserItem);

			// remove old avatar because of using in message
			if (userUpdate.avatar !== 'avatar-default.jpg') {
				await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);
			}

			let result = {
				message: transSuccess.info_updated,
				imageSrc: `/images/users/${req.file.filename}`
			}
			return res.status(200).send(result);
		} catch(error) {
			return res.status(500).send(error);
			console.log(error);
		}

	});
}

let updateInfo = async (req, res) => {
	let errors = [], success = [];
	let validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		errors = Object.values(validationErrors.mapped()).map((item) => item.msg);
		console.log(errors);
		return res.status(500).send(errors);
	}
	try {
		let updateUserItem = req.body;
		await user.updateUser(req.user._id, updateUserItem);
		let result = {
			message: transSuccess.info_updated
		}
		return res.status(200).send(result);
	} catch(error) {
		console.log(error);
		return res.status(500).send(error);
	}
}

let updatePassword = async (req, res) => {
	let errors = [];
	if (!validationResult(req).isEmpty()) {
		errors = Object.values(validationResult(req).mapped()).map(error => error.msg);
		return res.status(500).send(errors);
	}
	try {
		let updateUserItem = req.body;
		let updateStatus = await user.updatePassword(req.user._id, updateUserItem);

		if (updateStatus === true) {
			let result = {
				message: transSuccess.password_updated
			};
			return res.status(200).send(result);
		}
	} catch(error) {
		return res.status(500).send(error);
	}
}

module.exports = {
	updateAvatar: updateAvatar,
	updateInfo: updateInfo,
	updatePassword: updatePassword
}

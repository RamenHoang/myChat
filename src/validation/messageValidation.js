import { check } from 'express-validator/check';
import { transValidation } from '../../lan/vi';

let checkMessageLength = [
	check('messageVal', transValidation.message_text_emoji_incorrect)
		.isLength({ min: 1, max: 400 })
];

module.exports = {
	checkMessageLength: checkMessageLength
}

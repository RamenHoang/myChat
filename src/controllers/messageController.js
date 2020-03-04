import { validationResult } from 'express-validator/check';
import { message } from '../services/services';

let addNewTextEmoji = async (req, res) => {
  let errors = [];
	let validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		errors = Object.values(validationErrors.mapped()).map((item) => item.msg);
		console.log(errors);
		return res.status(500).send(errors);
  }
  
  try {
    let sender;
    sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar
    }

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await message.addNewTextEmoji(sender, receiverId, messageVal, isChatGroup);

    return res.status(200).send({message: newMessage});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  addNewTextEmoji: addNewTextEmoji
}

import { validationResult } from 'express-validator/check';
import { groupChat, message } from '../services/services';

let addNewGroup = async (req, res) => {
  let errors = [];
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errors = Object.values(validationErrors.mapped()).map(error => error.msg);
    return res.status(500).send(errors);
  }
  try {
    let newGroup = await groupChat.addNewGroup(
      req.user._id,
      req.body.arrIds,
      req.body.groupName
    );
    return res.status(200).send({ groupChat: newGroup });
  } catch (error) {
    return res.status(500).send(error);
  }
}

let addMoreMembers = async (req, res) => {
  try {
    let groupId = req.body.groupId;
    let member = req.body.member;
    let sender = {
      id: req.user._id,
      avatar: req.user.avatar,
      name: req.user.username
    }
    let messageVal = req.body.messageVal;

    let addStatus = await groupChat.addMoreMembers(groupId, member);
    let newMessage = await message.addNewTextEmoji(sender, groupId, messageVal, true);
    res.status(200).send({
      status: !!addStatus,
      message: newMessage
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

module.exports = {
  addNewGroup: addNewGroup,
  addMoreMembers: addMoreMembers
}

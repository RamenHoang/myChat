import { validationResult } from 'express-validator/check';
import { groupChat } from '../services/services';

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

module.exports = {
  addNewGroup: addNewGroup
}

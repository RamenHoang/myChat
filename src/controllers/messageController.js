import { validationResult } from 'express-validator/check';
import { message } from '../services/services';
import multer from 'multer';
import { app } from '../config/app';
import { transErrors, transSuccess } from '../../lan/vi';
import fsExtra from 'fs-extra';

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

    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
}


let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    let match = app.image_message_type;
    if (match.indexOf(file.mimetype) === -1) {
      return callback(transErrors.image_message_type, null);
    }

    let image_name = `${file.originalname}`;
    callback(null, image_name);
  }
});

let imageMessageUploadFile = multer({
  storage: storageImageChat,
  limits: { fileSize: app.image_message_limit_size }
}).single('my-image-chat');

let addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.image_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender;
      sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      }
  
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      let newMessage = await message.addNewImage(sender, receiverId, messageVal, isChatGroup);
  
      // Remove image
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });

}


let storageAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attachment_message_directory);
  },
  filename: (req, file, callback) => {
    let attachment_name = `${file.originalname}`;
    callback(null, attachment_name);
  }
});

let attachmentMessageUploadFile = multer({
  storage: storageAttachmentChat,
  limits: { fileSize: app.attachment_message_limit_size }
}).single('my-attachments-chat');
let addNewAttachment = (req, res) => {
  attachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transErrors.attachment_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      let sender;
      sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      }
  
      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;
  
      let newMessage = await message.addNewAttachment(sender, receiverId, messageVal, isChatGroup);
  
      // Remove attachment
      await fsExtra.remove(`${app.attachment_message_directory}/${newMessage.file.fileName}`);

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}
module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment
}

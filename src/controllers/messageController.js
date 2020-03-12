import { validationResult } from 'express-validator/check';
import { message } from '../services/services';
import multer from 'multer';
import { app } from '../config/app';
import { transErrors, transSuccess } from '../../lan/vi';
import fsExtra from 'fs-extra';
import ejs from 'ejs';
import { getDuration, getLastMessage, bufferToBase64 } from '../helpers/clientHelper';
import { promisify } from 'util'

// Make ejs render file function can use async-await
const renderFile = promisify(ejs.renderFile).bind(ejs);

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



let readMoreAllConversations = async (req, res) => {
  try {
    let skipPersonal = parseInt(req.query.skipPersonal, 10);
    let skipGroup = parseInt(req.query.skipGroup, 10);
    if (!skipPersonal) skipPersonal = 0;
    if (!skipGroup) skipGroup = 0;

    let newAllConversations = await message.readMoreAllConversations(req.user._id, skipPersonal, skipGroup);

    let dataToRender = {
      newAllConversations: newAllConversations,
      getDuration: getDuration,
      getLastMessage: getLastMessage,
      user: req.user,
      bufferToBase64: bufferToBase64
    }

    let leftSideData = await renderFile('src/views/main/readMoreConversations/_leftSide.ejs', dataToRender)
    let rightSideData = await renderFile('src/views/main/readMoreConversations/_rightSide.ejs', dataToRender)
    let imageModalData = await renderFile('src/views/main/readMoreConversations/_imageModal.ejs', dataToRender)
    let attachmentModalData = await renderFile('src/views/main/readMoreConversations/_attachmentModal.ejs', dataToRender)


    res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachmentModalData: attachmentModalData
    });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllConversations: readMoreAllConversations
}

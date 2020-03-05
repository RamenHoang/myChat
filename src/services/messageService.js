import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import ChatGroupModel from '../models/chatGroupModel';
import MessageModel from '../models/messageModel';
import { transErrors } from '../../lan/vi';
import { app } from '../config/app';
import fsExtra from 'fs-extra';

let getAllConversations = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Conversations include personal and group conversations
      // => Get all contacts of current user as personal conversations
      let conversations = await ContactModel.getContact(userId);
      // => Extract only needed field {_id, username, avatar, address}
      conversations = conversations.map(async (conversation) => {
        let conversationItem;
        if (conversation.contactId == userId) {
          conversationItem = await UserModel.getNormalUserDataById(conversation.userId);
        }
        else {
          conversationItem = await UserModel.getNormalUserDataById(conversation.contactId);
        }
        conversationItem.updatedAt = conversation.updatedAt;
        return conversationItem;
      });

      let userConversations = await Promise.all(conversations);

      // => Get group conversations
      let groupConversations = await ChatGroupModel.getChatGroups(userId);

      // Join personal and group conversations to all conversations, descending sorted by updatedAt
      let allConversations = userConversations.concat(groupConversations).sort((a, b) => {
        return b.updatedAt - a.updatedAt;
      });

      // => Push messages to each conversations
      let allConversationsPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if (conversation.members) {
          let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id);
          conversation.messages = getMessages.reverse();
        } else {
          let getMessages = await MessageModel.model.getMessagesInPersonal(userId, conversation._id);
          conversation.messages = getMessages.reverse();
        }
        return conversation;
      });

      let allconversationWithMessages = await Promise.all(allConversationsPromise);

      // => descending sorted all conversations by updatedAt again
      allconversationWithMessages = allconversationWithMessages.sort((a, b) => {
        return b.updatedAt - a.updatedAt;
      });

      resolve({
        allconversationWithMessages: allconversationWithMessages
      });
    } catch (error) {
      console.log('Get contact error: ', error);
      reject(error)
    }
  });
}

let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      let receiver, newMessageItem;
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        receiver = {
          id: receiverId,
          name: getChatGroupReceiver.name,
          avatar: app.group_avatar
        }

        newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversasionType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }

        // update group chat: field updatedAt
        await ChatGroupModel.updateWhenHasNewMessage(receiverId, getChatGroupReceiver.messageAmount + 1);
      } else {
        // Personal conversation
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        receiver = {
          id: receiverId,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }

        newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversasionType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }

        // update contact: field updatedAt
        await ContactModel.updateWhenHasNewMessage(sender.id, receiverId);
      }
      // create new message
      let newMessage = await MessageModel.model.createNew(newMessageItem);
      return resolve(newMessage);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    let imageBuffer = await fsExtra.readFile(messageVal.path);
    let imageContentType = messageVal.mimetype;
    let imageName = messageVal.originalname;
    
    try {
      let receiver, newMessageItem;
      if (isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if (!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        receiver = {
          id: receiverId,
          name: getChatGroupReceiver.name,
          avatar: app.group_avatar
        }

        newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversasionType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
          createdAt: Date.now()
        }

        // update group chat: field updatedAt
        await ChatGroupModel.updateWhenHasNewMessage(receiverId, getChatGroupReceiver.messageAmount + 1);
      } else {
        // Personal conversation
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if (!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        receiver = {
          id: receiverId,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        }

        newMessageItem = {
          senderId: sender.id,
          receiverId: receiverId,
          conversasionType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.IMAGE,
          sender: sender,
          receiver: receiver,
          file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
          createdAt: Date.now()
        }

        // update contact: field updatedAt
        await ContactModel.updateWhenHasNewMessage(sender.id, receiverId);
      }
      // create new message
      let newMessage = await MessageModel.model.createNew(newMessageItem);
      return resolve(newMessage);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

module.exports = {
  getAllConversations: getAllConversations,
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage
}

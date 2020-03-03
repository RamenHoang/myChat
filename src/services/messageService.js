import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import ChatGroupModel from '../models/chatGroupModel';
import MessageModel from '../models/messageModel';

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
          conversationItem =  await UserModel.getNormalUserDataById(conversation.userId);
        }
        conversationItem = await UserModel.getNormalUserDataById(conversation.contactId);
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
        let getMessages = await MessageModel.model.getMessages(userId, conversation._id);
        conversation = conversation.toObject();
        conversation.messages = getMessages;
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

module.exports = {
  getAllConversations: getAllConversations
}

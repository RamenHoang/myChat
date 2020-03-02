import ContactModel from '../models/contactModel';
import UserModel from '../models/userModel';
import ChatGroupModel from '../models/chatGroupModel';

let getAllConversasionItems = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let conversasions = await ContactModel.getContact(userId);
      conversasions = conversasions.map(async (conversasion) => {
        let conversasionItem;
        if (conversasion.contactId == userId) {
          conversasionItem =  await UserModel.getNormalUserDataById(conversasion.userId);
        }
        conversasionItem = await UserModel.getNormalUserDataById(conversasion.contactId);
        conversasionItem.updatedAt = conversasion.updatedAt;
        return conversasionItem;
      });

      let userConversasions = await Promise.all(conversasions);

      let groupConversations = await ChatGroupModel.getChatGroups(userId);

      let allConversasions = userConversasions.concat(groupConversations).sort((a, b) => {
        return -a.updatedAt + b.updatedAt;
      });
      resolve({
        userConversasions: userConversasions,
        groupConversations: groupConversations,
        allConversasions: allConversasions
      });
    } catch (error) {
      console.log('Get contact error: ', error);
      reject(error)
    }
  });
}

module.exports = {
  getAllConversasionItems: getAllConversasionItems
}

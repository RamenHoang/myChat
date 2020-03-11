import ChatGroupModel from '../models/chatGroupModel';

let addNewGroup = (currentUserId, arrIds, groupName) => {
  return new Promise(async (resolve, reject) => {
    try {
      arrIds = arrIds.map(obj => obj.userId).filter((id, index, arr) => {
        return (arr.indexOf(id, index + 1) !== -1) ? false : true;
      }).map(id => { return { userId: id }; });

      let groupChatItem = {
        name: groupName,
        userAmount: arrIds.length,
        userId: `${currentUserId}`,
        members: arrIds
      }

      let newGroup = await ChatGroupModel.createNew(groupChatItem);
      resolve(newGroup);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  addNewGroup: addNewGroup
}

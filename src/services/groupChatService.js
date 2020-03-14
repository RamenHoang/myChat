import ChatGroupModel from '../models/chatGroupModel';

let addNewGroup = (currentUserId, arrIds, groupName) => {
  return new Promise(async (resolve, reject) => {
    try {
      let arrs = [];
      arrIds.map(id => id.userId).filter((id, index, arr) => {
        if ((arr.indexOf(id, index + 1) !== -1)) {
          return false;
        }
        arrs.push(arrIds[index]);
        return true;
      })
      arrIds.length = 0;
      arrIds = arrs;
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

let searchGroups = (userId, keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let groups = await ChatGroupModel.searchGroups(userId, keyword);
      resolve(groups);
    } catch (error) {
      reject(error);
    }
  });
}

let getChatGroupById = (targetId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let group = await ChatGroupModel.getChatGroupById(targetId);
      resolve(group);
    } catch (error) {
      reject(error);
    }
  });
}

let addMoreMembers = (groupId, member) => {
  return new Promise(async (resolve, reject) => {
    try {
      let addStatus = await ChatGroupModel.addMoreMembers(groupId, member);
      resolve(addStatus);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  addNewGroup: addNewGroup,
  searchGroups: searchGroups,
  getChatGroupById: getChatGroupById,
  addMoreMembers: addMoreMembers
}

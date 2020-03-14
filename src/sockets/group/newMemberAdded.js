import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 *
 * @param {*} io from socket.io lib
 */
let newMemberAdded = io => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroups.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on('new-group-created', data => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

      data.groupChat.members.forEach(member => {
        if (clients[member.userId] && member.userId !== data.groupChat.userId) {
          clients[member.userId].forEach(socketId => clients[data.groupChat._id].push(socketId));
        }
      });
    });


    socket.on('new-member-added', data => {
      let response = {
        currentGroupId: data.groupId,
        currentUserId: socket.request.user._id,
        message: data.message,
        receiver: data.member
      }
      // emit notification
      if (clients[data.groupId]) {
        emitNotifyToArray(clients, data.groupId, io, 'response-new-member-added', response);
      }
      if (clients[data.member.memberId]) {
        emitNotifyToArray(clients, data.member.memberId, io, 'response-new-member-added', response);
      }
    });

    socket.on('disconnect', () => {
      // Remove socketId while disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
      socket.request.user.chatGroups.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });
    });
  });
};

module.exports = newMemberAdded;

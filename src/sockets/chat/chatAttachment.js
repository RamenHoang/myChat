import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 *
 * @param {*} io from socket.io lib
 */
let chatAttachment = io => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroups.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on('chat-attachment', data => {
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message
        }
        // emit notification
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, 'response-chat-attach', response);
        }
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message
        }
        // emit notification
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, 'response-chat-attach', response);
        }
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

module.exports = chatAttachment;

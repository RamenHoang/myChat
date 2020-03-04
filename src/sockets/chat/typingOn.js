import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 *
 * @param {*} io from socket.io lib
 */
let typingOn = io => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroups.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on('user-is-typing', data => {
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
        }
        // emit notification
        if (clients[data.groupId]) {
          emitNotifyToArray(clients, data.groupId, io, 'response-user-is-typing', response);
        }
      }
      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
        }
        // emit notification
        if (clients[data.contactId]) {
          emitNotifyToArray(clients, data.contactId, io, 'response-user-is-typing', response);
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

module.exports = typingOn;

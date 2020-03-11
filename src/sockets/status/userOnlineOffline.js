import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 *
 * @param {*} io from socket.io lib
 */
let userOnlineOffline = io => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroups.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on('check-onoff', () => {
      let listUserOnline = Object.keys(clients);
      // 1. Emit to user after loggin or F5
      socket.emit('server-send-list-users-online', listUserOnline);
      // 2. Emit to all others users when a new user is online
      socket.broadcast.emit('server-send-when-new-user-online', socket.request.user._id);
    })

    socket.on('disconnect', () => {
      // Remove socketId while disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
      socket.request.user.chatGroups.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket.id);
      });
      // 3. Emit to all others users when a new user is offline
      socket.broadcast.emit('server-send-when-new-user-offline', socket.request.user._id);
    });
  });
};

module.exports = userOnlineOffline;

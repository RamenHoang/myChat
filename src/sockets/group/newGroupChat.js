import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 *
 * @param {*} io from socket.io lib
 */
let newGroupChat = io => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);
    socket.request.user.chatGroups.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on('new-group-created', data => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);


      let response = {
        groupChat: data.groupChat
      };

      data.groupChat.members.forEach(member => {
        if (clients[member.userId] && member.userId !== data.groupChat.userId) {
          clients[member.userId].forEach(socketId => clients[data.groupChat._id].push(socketId));
          emitNotifyToArray(clients, member.userId, io, 'response-new-group-created', response);
        }
      });
      
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

module.exports = newGroupChat;

import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

let removeRequestContactSent = (io) => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on('remove-request-contact-sent', data => {
      let currentUser = {
        id: socket.request.user._id
      };

      // emit notification
      if (clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, 'response-remove-request-contact-sent', currentUser);
      }
    });

    socket.on('disconnect', () => {
      // Remove socketId while disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
    });
  });
}

module.exports = removeRequestContactSent;

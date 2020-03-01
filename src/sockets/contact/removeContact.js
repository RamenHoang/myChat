import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

let removeContact = io => {
  let clients = {};
  io.on('connect', socket => {
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on('remove-contact', data => {
      let currentUser = {
        id: socket.request.user._id
      };

      if (clients[data.contactId]) {
        emitNotifyToArray(clients, data.contactId, io, 'response-remove-contact', currentUser);
      }
    });

    socket.on('disconnect', () => {
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
    });
  });
}

module.exports = removeContact;

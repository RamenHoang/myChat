export const pushSocketIdToArray = (clients, currentUserId, socketId) => {
  if (clients[currentUserId]) {
    clients[currentUserId].push(socketId);
  } else {
    clients[currentUserId] = [socketId];
  }
  return clients;
};

export const emitNotifyToArray = (clients, userId, io, event, data) => {
  clients[userId].forEach(socketId => io.sockets.connected[socketId].emit(event, data));
};

export const removeSocketIdFromArray = (clients, currentUserId, _socketId) => {
  clients[currentUserId] = clients[currentUserId].filter(socketId => socketId !== _socketId);
  if (!clients[currentUserId].length) {
    delete clients[currentUserId];
  }
  return clients;
};

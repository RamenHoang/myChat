import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from '../../helpers/socketHelper';

/**
 *
 * @param {*} io from socket.io lib
 */
let chatVideo = io => {
  let clients = {};
  io.on('connection', socket => {
    // Create an object which contains all clients. In each client, there are all socket.id.
    clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

    socket.on('caller-check-listener-online', data => {
      if (clients[data.listenerId]) {
        //  online
        let response = {
          callerId: socket.request.user._id,
          listenerId: data.listenerId,
          callerName: data.callerName
        }

        emitNotifyToArray(clients, data.listenerId, io, 'server-request-peer-id-of-listener', response);
      } else {
        //  offline
        socket.emit('server-send-listener-offline');
      }
    });

    socket.on('listener-emit-peerId-to-server', data => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerPeerId: data.listenerPeerId,
        listenerName: data.listenerName
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, 'server-send-peer-id-of-listener-to-caller', response);
      }
    });

    socket.on('caller-request-call-to-server', data => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerPeerId: data.listenerPeerId,
        listenerName: data.listenerName
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, 'server-send-request-call-to-listener', response);
      }
    });

    socket.on('caller-cancel-request-call-to-server', data => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerPeerId: data.listenerPeerId,
        listenerName: data.listenerName
      };

      if (clients[data.listenerId]) {
        emitNotifyToArray(clients, data.listenerId, io, 'server-send-cancel-request-call-to-listener', response);
      }
    });

    socket.on('listener-reject-request-call-to-server', data => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerPeerId: data.listenerPeerId,
        listenerName: data.listenerName
      };

      if (clients[data.callerId]) {
        emitNotifyToArray(clients, data.callerId, io, 'server-send-reject-request-call-to-caller', response);
      }
    });
    
    socket.on('listener-accept-request-call-to-server', data => {
      let response = {
        callerId: data.callerId,
        listenerId: data.listenerId,
        callerName: data.callerName,
        listenerPeerId: data.listenerPeerId,
        listenerName: data.listenerName
      };

      if (clients[data.callerId] && clients[data.listenerId]) {
        emitNotifyToArray(clients, data.callerId, io, 'server-send-accept-request-call-to-caller', response);
        emitNotifyToArray(clients, data.listenerId, io, 'server-send-accept-request-call-to-listener', response);
      }
    });

    socket.on('disconnect', () => {
      // Remove socketId while disconnect
      clients = removeSocketIdFromArray(clients, socket.request.user._id, socket.id);
    });
  });
};

module.exports = chatVideo;

function videoChat(chatId) {
  $(`#video-chat-${chatId}`).unbind('click').on('click', function () {
    let targetId = $(this).data('chat');
    let callerName = $('#navbar-username').text();

    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }

    // 1. Caller: Check listener is online
    socket.emit('caller-check-listener-online', dataToEmit);
  })
}

$(document).ready(function () {
  // 2. Caller
  socket.on('server-send-listener-offline', function () {
    alertify.notify('Người dùng đang ngoại tuyến', 'error', 5);
  });

  let getPeerId = '';
  const peer = new Peer();
  peer.on('open', function (peerId) {
    getPeerId = peerId;
  });
  // 3. Listener
  socket.on('server-request-peer-id-of-listener', function (response) {
    let listenerName = $('#navbar-username').text();
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerPeerId: getPeerId,
      listenerName: listenerName
    }

    // 4. Listener
    socket.emit('listener-emit-peerId-to-server', dataToEmit);
  });

  // 5. Caller
  socket.on('server-send-peer-id-of-listener-to-caller', function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerPeerId: response.listenerPeerId,
      listenerName: response.listenerName
    }

    // 6. Caller
    socket.emit('caller-request-call-to-server', dataToEmit);

    Swal.fire({
      title: `Đang gọi &nbsp <span style="color: #2ecc71;">${response.listenerName}</span> &nbsp <i class="fa fa-volume-control-phone"></i>`,
      showConfirmButton: false,
      cancelButtonText: 'Huỷ',
      cancelButtonColor: '#ff7675',
      showCancelButton: true,
      allowOutsideClick: false,
      backdrop: 'rgba(85, 85, 85, 0.4)',
      timer: 15000,
      onOpen: () => {
        // 12. Caller
        socket.on('server-send-reject-request-call-to-caller', function (response) {
          Swal.close();

          Swal.fire({
            title: `<span style="color: #2ecc71;">${response.listenerName}</span> &nbsp đang bận!`,
            allowOutsideClick: false,
            backdrop: 'rgba(85, 85, 85, 0.4)',
            showConfirmButton: true,
            confirmButtonText: 'Chấp nhận',
            confirmButtonColor: '#2ecc71'
          }).then(result => {
            return false;
          });
        });

        // 13. Caller
        socket.on('server-send-accept-request-call-to-caller', function(response) {
          Swal.close();

          console.log(`ready call with ${response.listenerName}`);
        });
      }
    })
      .then(result => {
        if (result.dismiss) {
          // 7. Caller
          socket.emit('caller-cancel-request-call-to-server', dataToEmit);
        }
      });
  });

  //  8. Listener
  socket.on('server-send-request-call-to-listener', function (response) {
    let dataToEmit = {
      callerId: response.callerId,
      listenerId: response.listenerId,
      callerName: response.callerName,
      listenerPeerId: response.listenerPeerId,
      listenerName: response.listenerName
    }

    Swal.fire({
      title: `<span style="color: #2ecc71;">${response.callerName}</span> &nbsp đang gọi &nbsp <i class="fa fa-volume-control-phone"></i>`,
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Huỷ',
      cancelButtonColor: '#ff7675',
      confirmButtonText: 'Chấp nhận',
      confirmButtonColor: '#2ecc71',
      allowOutsideClick: false,
      backdrop: 'rgba(85, 85, 85, 0.4)',
      timer: 15000,
      onOpen: () => {
        // 9. Listener
        socket.on('server-send-cancel-request-call-to-listener', function (response) {
          Swal.close();
        });

        // 14. Listener
        socket.on('server-send-accept-request-call-to-listener', function(response) {
          Swal.close();

          console.log(`ready call with ${response.callerName}`);
        });
      }
    })
      .then(result => {
        if (result.dismiss) {
          // 10. Listener
          socket.emit('listener-reject-request-call-to-server', dataToEmit);
        }
        if (result.value) {
          // 11. Listener
          socket.emit('listener-accept-request-call-to-server', dataToEmit);
        }
      });
  });

});

// 1. 
socket.on('server-send-list-users-online', function (listUserIds) {
  listUserIds.forEach(function (id) {
    $(`.person[data-chat=${id}]`).find('div.dot').addClass('online');
    $(`.person[data-chat=${id}]`).find('img').addClass('avatar-online');
  });
});

// 2.
socket.on('server-send-when-new-user-online', function (newOnlineId) {
  $(`.person[data-chat=${newOnlineId}]`).find('div.dot').addClass('online');
  $(`.person[data-chat=${newOnlineId}]`).find('img').addClass('avatar-online');
});

// 3.
socket.on('server-send-when-new-user-offline', function(newOfflineId) {
  $(`.person[data-chat=${newOfflineId}]`).find('div.dot').removeClass('online');
  $(`.person[data-chat=${newOfflineId}]`).find('img').removeClass('avatar-online');
});
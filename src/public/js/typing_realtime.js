function typing(chatId) {
  let targetId = $(`#write-chat-${chatId}`).data('chat');

  if ($(`#write-chat-${chatId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-typing', { groupId: targetId });
  } else {
    socket.emit('user-is-typing', { contactId: targetId });
  }
}

function typingOff(chatId) {
  let targetId = $(`#write-chat-${chatId}`).data('chat');

  if ($(`#write-chat-${chatId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-not-typing', { groupId: targetId });
  } else {
    socket.emit('user-is-not-typing', { contactId: targetId });
  }
}

socket.on('response-user-is-typing', function (response) {
  let messageTyping = `<div class="bubble you bubble-typing-gif" style="padding: 0;margin: 0;">
    <img src="/images/chat/ezgif.com-resize.gif">
  </div>`;
  let chatId;
  if (response.currentGroupId) {
    chatId = response.currentGroupId;
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      // Kiểm tra xem đã có ảnh gif typing hay chưa
      // có => do nothing
      // không => show ra
      if (!$(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
        $(`.right .chat[data-chat=${chatId}]`).append(messageTyping);
      }
    } else return;
  } else {
    chatId = response.currentUserId;
    // Kiểm tra xem đã có ảnh gif typing hay chưa
    // có => do nothing
    // không => show ra
    if (!$(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
      $(`.right .chat[data-chat=${chatId}]`).append(messageTyping);
    } else return;
  }

  nineScrollRight(chatId);
  // nineScrollRight(chatId);

  // 4. Đổi dữ liệu tại preview và time
  // $(`.person[data-chat=${chatId}]`).find('.preview').addClass('message-time-realtime').html(`<strong>${response.message.sender.name}</strong>: ${response.message.text}`);
  // $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - response.message.createdAt) / 1000) + ' giây');
});

socket.on('response-user-is-not-typing', function (response) {
  let chatId;
  if (response.currentGroupId) {
    chatId = response.currentGroupId;
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      // Kiểm tra xem đã có ảnh gif typing hay chưa
      // có => do nothing
      // không => show ra
      if ($(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
        $(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').remove();
      }
    } else return;
  } else {
    chatId = response.currentUserId;
    // Kiểm tra xem đã có ảnh gif typing hay chưa
    // có => do nothing
    // không => show ra
    if ($(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
      $(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').remove();
    } else return;
  }

  nineScrollRight(chatId);
  // nineScrollRight(chatId);

  // 4. Đổi dữ liệu tại preview và time
  // $(`.person[data-chat=${chatId}]`).find('.preview').addClass('message-time-realtime').html(`<strong>${response.message.sender.name}</strong>: ${response.message.text}`);
  // $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - response.message.createdAt) / 1000) + ' giây');
});

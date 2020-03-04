function textAndEmojiChat(chatId) {
  $('.emojionearea').unbind('keyup').on('keyup', function (element) {
    $(`.person[data-chat=${chatId}]`).find('.preview').removeClass('message-time-realtime');

    let currentEmojioneArea = $(this);
    if (element.which === 13) {

      // 
      let targetId = $(`#write-chat-${chatId}`).data('chat');
      let messageVal = $(`#write-chat-${chatId}`).val();

      if (!targetId.length || !messageVal.length) {
        return false;
      }

      let dataTextEmojiForSent = {
        uid: chatId,
        messageVal: messageVal,
      };

      if ($(`#write-chat-${chatId}`).hasClass('chat-in-group')) {
        dataTextEmojiForSent.isChatGroup = true;
      }

      // Call ajax to server
      $.post('/message/add-new-text-emoji', dataTextEmojiForSent, function (data) {
        let dataToEmit = {
          message: data.message
        }


        // 1. Đẩy dữ liệu ra client
        increaseNumberMessageGroup(chatId);

        if (dataTextEmojiForSent.isChatGroup) {
          $(`.right .chat[data-chat=${chatId}]`).append(
            `
            <div class="bubble me" data-mess-id="${data.message._id}">
              <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>
              ${data.message.text}
            </div>
            `
          );
          dataToEmit.groupId = targetId;
        } else {
          $(`.right .chat[data-chat=${chatId}]`).append(
            `
            <div class="bubble me" data-mess-id="${data.message._id}">
              ${data.message.text}
            </div>
            `
          );
          dataToEmit.contactId = targetId;
        }

        // 2.Kéo thanh cuộn xuống cuối cùng
        nineScrollRight(chatId);

        // 3. Xoá dữ liệu ở thanh input
        $(`#write-chat-${chatId}`).val('');
        currentEmojioneArea.find('.emojionearea-editor').text('');

        // 4. Đổi dữ liệu tại preview và time
        $(`.person[data-chat=${chatId}]`).find('.preview').html(`<strong>Bạn</strong>: ${data.message.text}`);
        $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - data.message.createdAt) / 1000) + ' giây');

        // 5. Đẩy cuộc hội thoại lên đầu
        $(`.person[data-chat=${chatId}]`).on('toTop.moveConversationToTheTop', function () {
          let dataToMove = $(this).parent();
          $(this).closest('ul').prepend(dataToMove);
          $(this).off('click.moveConversationToTheTop');
        });
        $(`.person[data-chat=${chatId}]`).trigger('toTop.moveConversationToTheTop');

        // 6. Emit cho server
        socket.emit('chat-text-emoji', dataToEmit);

        // 7. remove typing
        typingOff(chatId);

        // 8. Nếu có ng dùng trong group đang typing, xoá ngay
        if ($(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
          $(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').remove();
        }
      }).fail(function (response) {
        // Error
        alertify.notify(response.responseText, 'error', 5);
      });
    }
  });
}

socket.on('response-chat-text-emoji', function (response) {
  let chatId;
  if (response.currentGroupId) {
    chatId = response.currentGroupId;
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      increaseNumberMessageGroup(chatId);
      $(`.right .chat[data-chat=${chatId}]`).append(
        `
        <div class="bubble you" data-mess-id="${response.message._id}">
          <img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>
          ${response.message.text}
        </div>
        `
      );
      // 4. Đổi dữ liệu tại preview và time
      $(`.person[data-chat=${chatId}]`).find('.preview').addClass('message-time-realtime').html(`<strong>${response.message.sender.name}</strong>: ${response.message.text}`);
      $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - response.message.createdAt) / 1000) + ' giây');
    }
  } else {
    chatId = response.currentUserId;
    $(`.right .chat[data-chat=${chatId}]`).append(
      `
      <div class="bubble you" data-mess-id="${response.message._id}">
        ${response.message.text}
      </div>
      `
    );
    // 4. Đổi dữ liệu tại preview và time
    $(`.person[data-chat=${chatId}]`).find('.preview').addClass('message-time-realtime').html(`<strong>${response.message.sender.name}</strong>: ${response.message.text}`);
    $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - response.message.createdAt) / 1000) + ' giây');
  }

  // 2.Kéo thanh cuộn xuống cuối cùng
  nineScrollRight(chatId);

  // 5. Đẩy cuộc hội thoại lên đầu
  $(`.person[data-chat=${chatId}]`).on('toTop.moveConversationToTheTop', function () {
    let dataToMove = $(this).parent();
    $(this).closest('ul').prepend(dataToMove);
    $(this).off('click.moveConversationToTheTop');
  });
  $(`.person[data-chat=${chatId}]`).trigger('toTop.moveConversationToTheTop');
});


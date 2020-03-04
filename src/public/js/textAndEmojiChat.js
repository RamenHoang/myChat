function textAndEmojiChat(chatId) {
  $('.emojionearea').unbind('keyup').on('keyup', function(element) {
    let currentEmojioneArea = $(this);
    if (element.which === 13) {
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
      $.post('/message/add-new-text-emoji', dataTextEmojiForSent, function(data) {
        // 1. Xử lý dữ liệu trước khi hiển thị
        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}">`);
        if (dataTextEmojiForSent.isChatGroup) {
          messageOfMe.html(`
            <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">
          `);
          messageOfMe.text(data.message.text);
        } else {
          messageOfMe.text(data.message.text);
        }

        // 2. Đẩy dữ liệu ra client
        increaseNumberMessageGroup(chatId);

        $( `.right .chat[data-chat=${chatId}]`).append(messageOfMe);

        // 3.Kéo thanh cuộn xuống cuối cùng
        nineScrollRight(chatId);

        // 4. Xoá dữ liệu ở thanh input
        $(`#write-chat-${chatId}`).val('');
        currentEmojioneArea.find('.emojionearea-editor').text('');

        // 5. Đổi dữ liệu tại preview và time
        $(`.person[data-chat=${chatId}]`).find('.preview').text(data.message.text);
        $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - data.message.createdAt) / 1000) + ' giây');

        // 6. Đẩy cuộc hội thoại lên đầu
        $(`.person[data-chat=${chatId}]`).on('click.moveConversationToTheTop', function() {
          let dataToMove = $(this).parent();
          $(this).closest('ul').prepend(dataToMove);
          $(this).off('click.moveConversationToTheTop');
        });
        $(`.person[data-chat=${chatId}]`).click();

        // 7. Emit cho server
      }).fail(function(response) {
        // Error
        alertify.notify(response.responseText, 'error', 5);
      });
    }
  });
}

function textAndEmojiChat(chatId) {
  $('.emojionearea').unbind('keyup').on('keyup', function(element) {
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
        // Success
        console.log(data);
      }).fail(function(response) {
        // Error
        alertify.notify(response.responseText, 'error', 5);
      });
    }
  });
}

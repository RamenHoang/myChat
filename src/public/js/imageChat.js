function bufferToBase64(buffer) {
  return btoa(new Uint8Array(buffer).reduce(function (data, byte) {
    return data + String.fromCharCode(byte);
  }, ''));
}

function imageChat(chatId) {
  $(`#image-chat-${chatId}`).unbind('change').on('change', function () {
    let fileData = $(this).prop('files')[0];
    let match = ['image/png', 'image/jpg', 'image/jpeg'];
    let limit = 1048576; // byte = 1mb

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify('Kiểu file không hợp lệ. Chỉ chấp nhận jpg hoặc png', 'error', 5);
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify('Ảnh có dung lượng tối đa là 1MB', 'error', 5);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data('chat');
    let isChatGroup = false;

    let imageFormData = new FormData();
    imageFormData.append('my-image-chat', fileData);
    imageFormData.append('uid', targetId);

    if ($(this).hasClass('chat-in-group')) {
      imageFormData.append('isChatGroup', true);
      isChatGroup = true;
    }

    $.ajax({
      url: '/message/add-new-image',
      type: 'post',
      cache: false,
      contentType: false,
      processData: false,
      data: imageFormData,
      success: function (data) {
        let dataToEmit = {
          message: data.message
        }

        let imageMessage = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat">`;
        increaseNumberMessageGroup(chatId);

        if (isChatGroup) {
          $(`.right .chat[data-chat=${chatId}]`).append(
            `
            <div class="bubble me bubble-image-file group" data-mess-id="${data.message._id}">
              <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>
              ${imageMessage}
            </div>
            `
          );
          dataToEmit.groupId = targetId;
        } else {
          $(`.right .chat[data-chat=${chatId}]`).append(
            `
            <div class="bubble me bubble-image-file" data-mess-id="${data.message._id}">
              ${imageMessage}
            </div>
            `
          );
          dataToEmit.contactId = targetId;
        }

        // 2.Kéo thanh cuộn xuống cuối cùng
        nineScrollRight(chatId);

        // 3. Xoá dữ liệu ở thanh input
        // Nothing

        // 4. Đổi dữ liệu tại preview và time
        $(`.person[data-chat=${chatId}]`).find('.preview').html(`<strong>Bạn</strong>: đã gửi một ảnh`);
        $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - data.message.createdAt) / 1000) + ' giây');

        // 5. Đẩy cuộc hội thoại lên đầu
        $(`.person[data-chat=${chatId}]`).on('toTop.moveConversationToTheTop', function () {
          let dataToMove = $(this).parent();
          $(this).closest('ul').prepend(dataToMove);
          $(this).off('click.moveConversationToTheTop');
        });
        $(`.person[data-chat=${chatId}]`).trigger('toTop.moveConversationToTheTop');

        // 6. Emit cho server
        socket.emit('chat-image', dataToEmit);

        // 7. remove typing
        // typingOff(chatId);

        // 8. Nếu có ng dùng trong group đang typing, xoá ngay
        if ($(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
          $(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').remove();
        }

        // 9. Đổ hình ảnh vào modal hình ảnh
        $(`#imagesModal_${chatId}`).find('div.all-images').append(
          `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`
        );
      },
      error: function (err) {
        alertify.notify(err.responseText, 'error', 5);
      }
    });
  })
}

socket.on('response-chat-image', function (response) {
  let chatId;
  let imageMessage = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat">`;
  if (response.currentGroupId) {
    chatId = response.currentGroupId;
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      increaseNumberMessageGroup(chatId);
      $(`.right .chat[data-chat=${chatId}]`).append(
        `
        <div class="bubble you bubble-image-file group" data-mess-id="${response.message._id}">
          <img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>
          ${imageMessage}
        </div>
        `
      );
      // 4. Đổi dữ liệu tại preview và time
      $(`.person[data-chat=${chatId}]`).find('.preview').addClass('message-time-realtime').html(`<strong>${response.message.sender.name}</strong>: đã gửi một ảnh`);
      $(`.person[data-chat=${chatId}]`).find('.time').text(Math.floor((Date.now() - response.message.createdAt) / 1000) + ' giây');
    }
  } else {
    chatId = response.currentUserId;
    $(`.right .chat[data-chat=${chatId}]`).append(
      `
      <div class="bubble you bubble-image-file" data-mess-id="${response.message._id}">
        ${imageMessage}
      </div>
      `
    );
    // 4. Đổi dữ liệu tại preview và time
    $(`.person[data-chat=${chatId}]`).find('.preview').addClass('message-time-realtime').html(`<strong>${response.message.sender.name}</strong>: đã gửi một ảnh`);
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

  // 8. Nếu có ng dùng trong group đang typing, xoá ngay
  if ($(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').length) {
    $(`.right .chat[data-chat=${chatId}]`).find('div.bubble-typing-gif').remove();
  }

  // 9. Đổ hình ảnh vào modal hình ảnh
  $(`#imagesModal_${chatId}`).find('div.all-images').append(
    `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">`
  );
});

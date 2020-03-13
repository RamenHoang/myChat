function readMoreMessage() {
  $('.right .chat').scroll(function() {

    // get top message
    let topMess = $(this).find('.bubble:first');
    // get height
    let currentHeight = topMess.offset().top - $(this).scrollTop();

    if ($(this).scrollTop() === 0) {
      let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading">`;
      $(this).prepend(messageLoading);

      let targetId = $(this).data('chat');
      let skipMess = $(this).find('div.bubble').length;
      let chatInGroup = $(this).parent().parent().find('.chat-in-group').length === 0 ? false : true;
      
      $.get(`/message/read-more?targetId=${targetId}&skipMess=${skipMess}&chatInGroup=${chatInGroup}`, function(data) {
        setTimeout(() => {
          if (data.rightSideData.trim() === '') {
            alertify.notify('Đã hiển thị hết tất cả tin nhắn', 'error', 5);
            $(`.right .chat[data-chat=${targetId}]`).find('.message-loading').remove();
          } else {
            $(`.right .chat[data-chat=${targetId}]`).find('.message-loading').remove();
            // 2. Render rightSide
            $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
            $(`.right .chat[data-chat=${targetId}]`).scrollTop(topMess.offset().top - currentHeight);
            // ---------------------------------------------------
    
    
            // 3. Render imageModal
            $(`#imagesModal_${targetId} .all-images`).append(data.imageModalData);
            // Sắp xếp lại ảnh trong imageModal
            gridPhotos(5);
            // ---------------------------------------------------
    
    
            // 4. Render attachmentModal
            $(`#attachmentsModal_${targetId} .list-attachments`).append(data.attachmentModalData);
            // ---------------------------------------------------
          }
        }, 300);
      });
    }
  });
}

$(document).ready(function() {
  readMoreMessage();
});

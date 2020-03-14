function clickAndDirectToChat() {
  $('.user-talk').on('click', function() {
    let targetId = $(this).data('uid');
    let isGroup = $(this).hasClass('is-group');
    
    if ($('#all-chat ul').find(`li[data-chat=${targetId}]`).length > 0) {
      $('#all-chat ul').find(`li[data-chat=${targetId}]`).click();
    } else {
      $.get(`/message/get-conversation-with-message?targetId=${targetId}&isGroup=${isGroup}`, function(data) {
        // 1. Render leftSide
        $('#all-chat').find('ul').prepend(data.leftSideData);
        // Cho phép thay đổi màn hình chat và kích hoạt các tính năng chat
        changeScreenChat();
        // Cấu hình thanh cuộn trái
        resizeScrollLeft();
        nineScrollLeft();
        // ---------------------------------------------------


        // 2. Render rightSide
        $('#screen-chat').append(data.rightSideData);
        // Kích hoatj xem thêm tin nhắn
        readMoreMessage();
        // Cho phép xem hình ảnh
        showImage();
        // ---------------------------------------------------


        // 3. Render imageModal
        $('body').append(data.imageModalData);
        // Sắp xếp lại ảnh trong imageModal
        gridPhotos(5);
        // ---------------------------------------------------


        // 4. Render attachmentModal
        $('body').append(data.attachmentModalData);
        // ---------------------------------------------------

        // 5. Kiểm tra online-offline
        socket.emit('check-onoff');

        // 6. Chuyển màn hình chat sang cuộc trò truyện này ngay
        $('#all-chat ul').find(`li[data-chat=${targetId}]`).click();

        // 7. Ẩn modal
        $('#contactsModal').modal('hide'); 
      });
    }
  });
}

$(document).ready(function() {
  clickAndDirectToChat();
});

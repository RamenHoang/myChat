$(document).ready(function () {
  // Contact
  $('#link-read-more-all-conversation').bind('click', function () {
    let skipPersonal = $('#all-chat').find('li:not(.group-chat)').length;
    let skipGroup = $('#all-chat').find('li.group-chat').length;

    $.get(`/message/read-more-all-conversation?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function (data) {
      if (data.leftSideData.trim() === '') {
        alertify.notify('Đã hiển thị hết tất cả cuộc trò chuyện', 'error', 5);
      } else {
        // 1. Render leftSide
        $('#all-chat').find('ul').append(data.leftSideData);
        // Cho phép thay đổi màn hình chat và kích hoạt các tính năng chat
        changeScreenChat();
        // Cấu hình thanh cuộn trái
        resizeScrollLeft();
        nineScrollLeft();
        // ---------------------------------------------------


        // 2. Render rightSide
        $('#screen-chat').append(data.rightSideData);
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
      }
    });
  });

  // Contact's request sent
  $('#link-read-more-all-conversation-sent').bind('click', function () {
    let skipNumber = $('#request-contact-sent ul.contactList').find('li').length;

    $.get(`/contact/read-more-contact-sent?skipNumber=${skipNumber}`, function (contacts) {
      if (contacts.length === 0) {
        alertify.notify('Đã hiển thị hết tất cả yêu cầu', 'error', 5);
        return;
      }
      contacts.forEach(function (contact) {
        $('#request-contact-sent ul.contactList').append(
          `<li class="_contactList" data-uid="${contact._id}">
              <div class="contactPanel">
                  <div class="user-avatar">
                      <img src="images/users/${contact.avatar}" alt="">
                  </div>
                  <div class="user-name">
                      <p>
                          ${contact.username}
                      </p>
                  </div>
                  <br>
                  <div class="user-address">
                      <span>&nbsp; ${contact.address}</span>
                  </div>
                  <div class="user-remove-request-sent action-danger" data-uid="${contact._id}">
                      Hủy yêu cầu
                  </div>
              </div>
          </li>`
        );
      }
      );
      // Cho phép huỷ đi yêu cầu vừa đươc tạo ra ở tab "đang chờ xác nhận"
      removeRequestContactSent();
    });
  });

  // Contact's request received 
  $('#link-read-more-all-conversation-received').bind('click', function () {
    let skipNumber = $('#request-contact-received ul.contactList').find('li').length;

    $.get(`/contact/read-more-contact-received?skipNumber=${skipNumber}`, function (contacts) {
      if (contacts.length === 0) {
        alertify.notify('Đã hiển thị hết tất cả yêu cầu', 'error', 5);
        return;
      }
      contacts.forEach(function (contact) {
        $('#request-contact-received ul.contactList').append(
          `<li class="_contactList" data-uid="${contact.id}">
              <div class="contactPanel">
                  <div class="user-avatar">
                      <img src="images/users/${contact.avatar}" alt="">
                  </div>
                  <div class="user-name">
                      <p>
                          ${contact.username}
                      </p>
                  </div>
                  <br>
                  <div class="user-address">
                      <span>&nbsp ${contact.address}</span>
                  </div>
                  <div class="user-acccept-contact-received" data-uid="${contact.id}">
                      Chấp nhận
                  </div>
                  <div class="user-reject-request-contact-received action-danger" data-uid="${contact.id}">
                      Xóa yêu cầu
                  </div>
              </div>
            </li>`
        );
      });
      // Cho phép huỷ những yêu cầu kết bạn
      removeRequestContactReceived();
      // Cho phép chấp nhận yêu cầu kết bạn
      acceptRequestContact();
    });
  });
});

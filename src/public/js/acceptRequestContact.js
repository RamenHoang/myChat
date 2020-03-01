function accceptContact(targetId) {
  $.ajax({
    url: '/contact/accept-request-contact',
    method: 'put',
    data: { uid: targetId },
    success: function(result) {
      if (result) {
        // Giảm số lượng số thông báo
        decreaseNumberNotification('noti_contact_counter', 1);
        decreaseNumberNotification('noti_counter', 1);
        decreaseNumberNotifContact('count-request-contact-received');

        // Tạo và chuyển contactPanel sang tab "Danh bạ", đồng thời xoá ở tab "Yêu cầu kết bạn"
        let contactPanel = $('#request-contact-received ul.contactList').find(`li[data-uid=${targetId}]`);
        $(contactPanel).find('.user-acccept-contact-received').remove();
        $(contactPanel).find('.user-reject-request-contact-received').remove();
        $(contactPanel).find('.contactPanel').append(
          `<div class="user-talk" data-uid="${targetId}">
              Trò chuyện
          </div>
          <div class="user-remove-contact action-danger" data-uid="${targetId}">
              Xóa liên hệ
          </div>`
        );

        $('#contacts').find('ul.contactList').prepend($(contactPanel).get(0).outerHTML);
        $(contactPanel).remove();

        // Tăng số danh bạ ở tab "Danh bạ"
        increaseNumberNotifContact('count-contacts');

        // Emit sự kiện lên server
        socket.emit('accept-request-contact', { contactId: targetId });
      }
    }
  })
}

function acceptRequestContact() {
  $('.user-acccept-contact-received').unbind('click').on('click', function() {
    let targetId = $(this).data('uid');

    // Put lên server để cập nhật lại status của danh bạ
    accceptContact(targetId);
  });
}

socket.on('response-accept-request-contact', function(user) {
  let notif = `<div class="notif-readed-false" data-uid="${user.id}">
								<img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
								<strong>${user.username}</strong> đã chấp nhận yêu cầu kết bạn!
							</div>`;
	$('.noti_content').prepend(notif);
	$('.list-notifications').prepend(`<li>${notif}</li>`);

  increaseNumberNotification('noti_counter', 1);
  decreaseNumberNotification('noti_contact_counter', 1);
  decreaseNumberNotifContact('count-request-contact-sent');

  $('#request-contact-sent ul.contactList').find(`li[data-uid=${user.id}]`).remove();

  $('#find-user ul.contactList').find(`li[data-uid=${user.id}]`).remove();

  let contactPanelHTML = 
  `<li class="_contactList" data-uid="${user.id}">
      <div class="contactPanel">
          <div class="user-avatar">
              <img src="images/users/${user.avatar}" alt="">
          </div>
          <div class="user-name">
              <p>
                  ${user.username}
              </p>
          </div>
          <br>
          <div class="user-address">
              <span>&nbsp ${user.address}</span>
          </div>
          <div class="user-talk" data-uid="${user.id}">
              Trò chuyện
          </div>
          <div class="user-remove-contact action-danger" data-uid="${user.id}">
              Xóa liên hệ
          </div>
      </div>
    </li>`;
  
  $('#contacts ul.contactList').prepend(contactPanelHTML);
  increaseNumberNotifContact('count-contacts', 1);
});

$(document).ready(function() {
  acceptRequestContact();
});


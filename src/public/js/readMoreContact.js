$(document).ready(function() {
  // Contact
  $('#link-read-more-contact').bind('click', function() {
    let skipNumber = $('#contacts ul.contactList').find('li').length;

    $.get(`/contact/read-more-contact?skipNumber=${skipNumber}`, function(contacts) {
      if (contacts.length === 0) {
        alertify.notify('Đã hiển thị hết tất cả bạn bè', 'error', 5);
        return;
      }
      contacts.forEach(function(contact) {
        $('#contacts ul.contactList').append(
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
                  <div class="user-talk" data-uid="${contact._id}">
                      Trò chuyện
                  </div>
                  <div class="user-remove-contact action-danger" data-uid="${contact._id}">
                      Xóa liên hệ
                  </div>
              </div>
          </li>`
        );
      });
    });
  });

  // Contact's request sent
  $('#link-read-more-contact-sent').bind('click', function() {
    let skipNumber = $('#request-contact-sent ul.contactList').find('li').length;

    console.log(skipNumber);
    $.get(`/contact/read-more-contact-sent?skipNumber=${skipNumber}`, function(contacts) {
      if (contacts.length === 0) {
        alertify.notify('Đã hiển thị hết tất cả yêu cầu', 'error', 5);
        return;
      }
      contacts.forEach(function(contact) {
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
      });
    });
  });

  // Contact's request received 
  $('#link-read-more-contact-received').bind('click', function() {
    let skipNumber = $('#request-contact-received ul.contactList').find('li').length;

    $.get(`/contact/read-more-contact-received?skipNumber=${skipNumber}`, function(contacts) {
      if (contacts.length === 0) {
        alertify.notify('Đã hiển thị hết tất cả yêu cầu', 'error', 5);
        return;
      }
      contacts.forEach(function(contact) {
        $('#request-contact-received>ul.contactList').append(
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
    });
  });
});

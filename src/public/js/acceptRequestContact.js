function acceptRequestContact() {
  $('.user-acccept-contact-received').unbind('click').on('click', function () {
    let targetId = $(this).data('uid');
    let targetName = $(this).parent().find('div.user-name p').text().trim();
    let targetAvatar = $(this).parent().find('div.user-avatar img').attr('src');
    // Put lên server để cập nhật lại status của danh bạ
    $.ajax({
      url: '/contact/accept-request-contact',
      method: 'put',
      data: { uid: targetId },
      success: function (result) {
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

          // Cho phép xoá danh bạ
          removeContact();

          // Tăng số danh bạ ở tab "Danh bạ"
          increaseNumberNotifContact('count-contacts');

          // Emit sự kiện lên server
          socket.emit('accept-request-contact', { contactId: targetId });

          // Xử lý realtime phần chat sau khi chấp nhận kết bạn
          // 1. Đẩy người dùng mới vào leftSide
          let subUserName = targetName;
          if (subUserName.length > 15) {
            subUserName = subUserName.slice(0, 12) + '...';
          }
          let leftSide = `
              <a href="#uid_${targetId}" class="room-chat" data-target="#to_${targetId}">
                  <li class="person" data-chat="${targetId}">
                      <div class="left-avatar">
                          <div class="dot"></div>
                          <img src="${targetAvatar}" alt="">
                      </div>
                      <div class="name">
                          ${subUserName}
                      </div>
                      <span class="time"></span>
                      <span class="preview">
                          
                      </span>
                  </li>
              </a>
          `;
          $('#all-chat').find('ul').prepend(leftSide);
          $('#user-chat').find('ul').prepend(leftSide);

          // 3. Đẩy group mới vào rightSide
          let rightSide = `
              <div class="right tab-pane" data-chat="${targetId}"
              id="to_${targetId}">
                  <div class="top">
                      <span>To: <span class="name">${targetName}</span></span>
                      <span class="chat-menu-right">
                          <a href="#attachmentsModal_${targetId}" class="show-attachments" data-toggle="modal">
                              Tệp đính kèm
                              <i class="fa fa-paperclip"></i>
                          </a>
                      </span>
                      <span class="chat-menu-right">
                          <a href="javascript:void(0)">&nbsp;</a>
                      </span>
                      <span class="chat-menu-right">
                          <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                              Hình ảnh
                              <i class="fa fa-photo"></i>
                          </a>
                      </span>
                  </div>
                  <div class="content-chat">
                      <div class="chat" data-chat="${targetId}">
                          
                      </div>
                  </div>
                  <div class="write" data-chat="${targetId}">
                      <input type="text" class="write-chat" id="write-chat-${targetId}"
                          data-chat="${targetId}">
                      <div class="icons">
                          <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                          <label for="image-chat-${targetId}">
                              <input type="file" id="image-chat-${targetId}" name="my-image-chat"
                                  class="image-chat" data-chat="${targetId}">
                              <i class="fa fa-photo"></i>
                          </label>
                          <label for="attachments-chat-${targetId}">
                              <input type="file" id="attachments-chat-${targetId}" name="my-attachments-chat"
                                  class="attachments-chat" data-chat="${targetId}">
                              <i class="fa fa-paperclip"></i>
                          </label>
                          <a href="#" id="video-chat-${targetId}" class="video-chat" data-chat="${targetId}"
                              >
                              <i class="fa fa-video-camera"></i>
                          </a>
                      </div>
                      <!-- <button style="background: transparent;border: none;right: 20px;">
                          <i class="fa fa-paper-plane" aria-hidden="true"></i>
                      </button> -->
                  </div>
              </div>
          `;
          $('#screen-chat').append(rightSide);

          // 4. Kích hoạt changeScreenChat
          changeScreenChat();

          // 5. Kích hoạt imageModal và attachmentModal
          let imageModal = `
              <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">Tất cả hình ảnh</h4>
                          </div>
                          <div class="modal-body">
                              <div class="all-images" style="visibility: hidden;">
                      
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
          $('body').append(imageModal);

          let attachModal = `
              <div class="modal fade" id="attachmentsModal_${targetId}" role="dialog">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">Tất cả tệp</h4>
                          </div>
                          <div class="modal-body">
                              <ul class="list-attachments">
                                  
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          `;
          $('body').append(attachModal);

          // 6. Kích hoạt gridPhoto trong imageModal
          gridPhotos(5);

          // 7. Kiểm tra trạng thái online-offline
          socket.emit('check-onoff');
        }
      }
    });
  });
}

socket.on('response-accept-request-contact', function (user) {
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
  // Cho phép xoá danh bạ
  removeContact();
  increaseNumberNotifContact('count-contacts', 1);

  // Xử lý realtime phần chat sau khi chấp nhận kết bạn
  // 1. Đẩy người dùng mới vào leftSide
  let subUserName = user.username;
  if (subUserName.length > 15) {
    subUserName = subUserName.slice(0, 12) + '...';
  }
  let leftSide = `
              <a href="#uid_${user.id}" class="room-chat" data-target="#to_${user.id}">
                  <li class="person" data-chat="${user.id}">
                      <div class="left-avatar">
                          <div class="dot"></div>
                          <img src="images/users/${user.avatar}" alt="">
                      </div>
                      <div class="name">
                          ${subUserName}
                      </div>
                      <span class="time"></span>
                      <span class="preview">
                          
                      </span>
                  </li>
              </a>
          `;
  $('#all-chat').find('ul').prepend(leftSide);
  $('#user-chat').find('ul').prepend(leftSide);

  // 3. Đẩy group mới vào rightSide
  let rightSide = `
              <div class="right tab-pane" data-chat="${user.id}"
              id="to_${user.id}">
                  <div class="top">
                      <span>To: <span class="name">${user.username}</span></span>
                      <span class="chat-menu-right">
                          <a href="#attachmentsModal_${user.id}" class="show-attachments" data-toggle="modal">
                              Tệp đính kèm
                              <i class="fa fa-paperclip"></i>
                          </a>
                      </span>
                      <span class="chat-menu-right">
                          <a href="javascript:void(0)">&nbsp;</a>
                      </span>
                      <span class="chat-menu-right">
                          <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                              Hình ảnh
                              <i class="fa fa-photo"></i>
                          </a>
                      </span>
                  </div>
                  <div class="content-chat">
                      <div class="chat" data-chat="${user.id}">
                          
                      </div>
                  </div>
                  <div class="write" data-chat="${user.id}">
                      <input type="text" class="write-chat" id="write-chat-${user.id}"
                          data-chat="${user.id}">
                      <div class="icons">
                          <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                          <label for="image-chat-${user.id}">
                              <input type="file" id="image-chat-${user.id}" name="my-image-chat"
                                  class="image-chat" data-chat="${user.id}">
                              <i class="fa fa-photo"></i>
                          </label>
                          <label for="attachments-chat-${user.id}">
                              <input type="file" id="attachments-chat-${user.id}" name="my-attachments-chat"
                                  class="attachments-chat" data-chat="${user.id}">
                              <i class="fa fa-paperclip"></i>
                          </label>
                          <a href="#" id="video-chat-${user.id}" class="video-chat" data-chat="${user.id}"
                              >
                              <i class="fa fa-video-camera"></i>
                          </a>
                      </div>
                      <!-- <button style="background: transparent;border: none;right: 20px;">
                          <i class="fa fa-paper-plane" aria-hidden="true"></i>
                      </button> -->
                  </div>
              </div>
          `;
  $('#screen-chat').append(rightSide);

  // 4. Kích hoạt changeScreenChat
  changeScreenChat();

  // 5. Kích hoạt imageModal và attachmentModal
  let imageModal = `
              <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">Tất cả hình ảnh</h4>
                          </div>
                          <div class="modal-body">
                              <div class="all-images" style="visibility: hidden;">
                      
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  $('body').append(imageModal);

  let attachModal = `
              <div class="modal fade" id="attachmentsModal_${user.id}" role="dialog">
                  <div class="modal-dialog modal-lg">
                      <div class="modal-content">
                          <div class="modal-header">
                              <button type="button" class="close" data-dismiss="modal">&times;</button>
                              <h4 class="modal-title">Tất cả tệp</h4>
                          </div>
                          <div class="modal-body">
                              <ul class="list-attachments">
                                  
                              </ul>
                          </div>
                      </div>
                  </div>
              </div>
          `;
  $('body').append(attachModal);

  // 6. Kích hoạt gridPhoto trong imageModal
  gridPhotos(5);

  // 7. Kiểm tra trạng thái online-offline
  socket.emit('check-onoff');
});

$(document).ready(function () {
  acceptRequestContact();
});


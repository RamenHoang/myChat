function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find(`div[data-uid=${uid}]`).html();

    let promise = new Promise(function (resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-friends').find(`div[data-uid=${uid}]`).remove();
    });
  });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#input-search-friends-to-add-group-chat').val(null);
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}

function getLastMessage(messages, userId) {
  if (!messages.length) return '';
  let lastMes = messages[messages.length - 1];
  if (lastMes.messageType === 'text') {
    if (lastMes.senderId == userId) return `<strong>Bạn</strong>: ${lastMes.text}`;
    return `<strong>${lastMes.sender.name}</strong>: ${lastMes.text}`;
  }
  if (lastMes.messageType === 'image') {
    if (lastMes.senderId == userId) return 'Bạn đã gửi một ảnh';
    return `<strong>${lastMes.sender.name}</strong> đã gửi một ảnh`;
  }
  if (lastMes.messageType === 'file') {
    if (lastMes.senderId == userId) return 'Bạn đã gửi một file';
    return `<strong>${lastMes.sender.name}</strong> đã gửi một file`;
  }
}

function getDuration(messages) {
  if (!messages.length) return '';
  let lastMes = messages[messages.length - 1];
  let timeAgo = Date.now() - lastMes.createdAt;
  timeAgo /= 1000;
  if (timeAgo > 1 && timeAgo < 59) return `${Math.floor(timeAgo)} giây`;
  else if (timeAgo / 60 > 1 && timeAgo / 60 < 59) return `${Math.floor(timeAgo / 60)} phút`;
  else if (timeAgo / 3600 > 1 && timeAgo / 3600 < 23) return `${Math.floor(timeAgo / 3600)} giờ`;
  return `${Math.floor(timeAgo / 3600 / 24)} ngày`;
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === 'click') {
    let keyword = $('#input-search-friends-to-add-group-chat').val();

    if (!keyword.length) {
      alertify.notify('Bạn chưa nhập nội dung tìm kiếm', 'error', 5);
      return;
    }
    if (!keyword.match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{3,17}$/)) {
      alertify.notify('Tên cần tìm không cho phép các kí tự đặc biệt', 'error', 5);
      return;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $('ul#group-chat-friends').html(data);

      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $('#btn-create-group-chat').unbind('click').on('click', function () {
    if ($('ul#friends-added').find('li').length < 2) {
      alertify.notify('Tối thiểu 2 bạn người để tạo nhóm', 'error', 5);
      return;
    }

    let groupName = $('#input-name-group-chat').val();
    if (groupName.length < 2 || groupName.length > 30
      || !groupName.match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)) {
      alertify.notify('Tên nhóm có độ dài từ 3 đến 30 kí tự và không chứa các kí tự đặc biệt', 'error', 5);
      return;
    }

    let arrIds = [];
    $('ul#friends-added').find('li').each(function (index, item) {
      arrIds.push({
        'userId': $(item).data('uid'),
        'username': $(item).find('span.user-name').text(),
        'avatar': $(item).find('div.user-avatar img').attr('src').split('/')[2]
      })
    });
    arrIds.push({
      'userId': $('#dropdown-navbar-user').data('uid'),
      'username': $('#dropdown-navbar-user').find('span#navbar-username').text(),
      'avatar': $('#dropdown-navbar-user').find('img').attr('src').split('/')[2]
    });

    $.post('/group-chat/add-new', {
      arrIds: arrIds,
      groupName: groupName
    }, function (data) {
      // 1. Đóng modal tạo group
      $('#btn-cancel-group-chat').click();
      $('#groupChatModal').modal('hide');

      // 2. Đẩy group mới vào leftSide
      let subName = data.groupChat.name;
      if (subName.length > 15) {
        subName = subName.slice(0, 12) + '...';
      }
      let leftSide = `
        <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
          <li class="person group-chat" data-chat="${data.groupChat._id}">
              <div class="left-avatar">
                  <img class="avatar-online" src="images/users/group-avatar-trungquandev.png" alt="">
              </div>
              <div class="name">
                  <span class="group-chat-name">
                      ${subName}
                  </span> 
              </div>
              <span class="time">  </span>
              <span class="preview">
                  
              </span>
          </li>
      </a>
      `;
      $('#all-chat').find('ul').prepend(leftSide);
      $('#group-chat').find('ul').prepend(leftSide);

      // 3. Đẩy group mới vào rightSide
      let rightSide = `
      <div class="right tab-pane" data-chat="${data.groupChat._id}"
      id="to_${data.groupChat._id}">
          <div class="top">
              <span>To: <span class="name">${data.groupChat.name}</span></span>
              <span class="chat-menu-right">
                  <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#membersModal_${data.groupChat._id}" class="number-members" data-toggle="modal">
                      <span class="show-number-members">${data.groupChat.userAmount}</span>
                      <i class="fa fa-users"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                      <span class="show-number-messages">${data.groupChat.messageAmount}</span>
                      <i class="fa fa-comment -o"></i>
                  </a>
              </span>
          </div>
          <div class="content-chat">
              <div class="chat" data-chat="${data.groupChat._id}">
              </div>
          </div>
          <div class="write" data-chat="${data.groupChat._id}">
              <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}"
                  data-chat="${data.groupChat._id}">
              <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${data.groupChat._id}">
                      <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                          class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachments-chat-${data.groupChat._id}">
                      <input type="file" id="attachments-chat-${data.groupChat._id}" name="my-attachments-chat"
                          class="attachments-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-paperclip"></i>
                  </label>
                  <!-- <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${data.groupChat._id}" data-toggle="modal">
                              <i class="fa fa-video-camera"></i>
                          </a> -->
                  <input type="hidden" id="peer-id" value="">
                  <!-- <input type="button" value="sent"> -->
              </div>
          </div>
      </div>
      `;
      $('#screen-chat').append(rightSide);

      // 4. Kích hoạt changeScreenChat
      changeScreenChat();

      // 5. Kích hoạt imageModal và attachmentModal
      let imageModal = `
      <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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
          <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
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

      // 7. Emit sk tới server
      socket.emit('new-group-created', { groupChat: data.groupChat });

      //   8. Kich hoat member modal
      let memberAdded = '';
      data.groupChat.members.forEach(function(member) {
        memberAdded += `
            <li data-uid="${member.userId}">
            <div class="contactPanelMember">
                <div class="user-avatar">
                    <img src="images/users/${member.avatar}" alt="">
                </div>
                <div class="user-name">
                    <span class="user-name">${member.username}</span>
                </div>
                <br>
            </div>
        </li>
        `
      });
      let memberModal = `
      <div class="modal fade" id="membersModal_${data.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Quản lý thành viên</h4>
              </div>
              <div class="modal-body">
                    <div class="col-md-5 col-sm-12 find-user-add-to-group">
                        <div class="row form-search-to-add">
                            <div class="form-group">
                                <input type="text" class="form-control add-more-members" id="input-search-friends-to-add-group-chat_${data.groupChat._id}" placeholder="Tìm bạn bè để thêm vào nhóm" />
                                <span class="input-group-btn">
                                    <button class="btn btn-lg btn-add-more-members" type="button" id="btn-search-friends-to-add-group-chat_${data.groupChat._id}">
                                        <i class="glyphicon glyphicon-search"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div class="row result-searched">
                            <ul id="group-chat-more-friends" class="${data.groupChat._id}"> 
                            </ul>
                        </div>
                    </div>

                    <div class="col-md-5 col-sm-12 list-user-added-member">
                        <ul id="friend-added">`+
                        
                          memberAdded +
                            
                        `</ul>
                        <div class="text-center" id="action-create-name-chat">
                            <br>
                            <button type="button" class="btn btn-primary" id="btn-save-group-chat">Thêm</button>
                            <button type="button" class="btn btn-danger" id="btn-cancel-group-chat">Hủy</button>
                        </div>
                    </div>
              </div>
          </div>
      </div>
    </div>
  `;
      $('body').append(memberModal);
      allowAddMoreFriendToGroup();

    }).fail(function (response) {
      alertify.notify(response.responseText, 'error', 5);
    });
  });
}

socket.on('response-new-group-created', function (data) {
  let subName = data.groupChat.name;
  if (subName.length > 15) {
    subName = subName.slice(0, 12) + '...';
  }
  let leftSide = `
        <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
          <li class="person group-chat" data-chat="${data.groupChat._id}">
              <div class="left-avatar">
                  <img class="avatar-online" src="images/users/group-avatar-trungquandev.png" alt="">
              </div>
              <div class="name">
                  <span class="group-chat-name">
                      ${subName}
                  </span> 
              </div>
              <span class="time">  </span>
              <span class="preview">
                  
              </span>
          </li>
      </a>
      `;
  $('#all-chat').find('ul').prepend(leftSide);
  $('#group-chat').find('ul').prepend(leftSide);

  // 3. Đẩy group mới vào rightSide
  let rightSide = `
      <div class="right tab-pane " data-chat="${data.groupChat._id}"
      id="to_${data.groupChat._id}">
          <div class="top">
              <span>To: <span class="name">${data.groupChat.name}</span></span>
              <span class="chat-menu-right">
                  <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                      Tệp đính kèm
                      <i class="fa fa-paperclip"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="#membersModal_${data.groupChat._id}" class="number-members" data-toggle="modal">
                      <span class="show-number-members">${data.groupChat.userAmount}</span>
                      <i class="fa fa-users"></i>
                  </a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
              </span>
              <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                      <span class="show-number-messages">${data.groupChat.messageAmount}</span>
                      <i class="fa fa-comment -o"></i>
                  </a>
              </span>
          </div>
          <div class="content-chat">
              <div class="chat" data-chat="${data.groupChat._id}">
              </div>
          </div>
          <div class="write" data-chat="${data.groupChat._id}">
              <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}"
                  data-chat="${data.groupChat._id}">
              <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${data.groupChat._id}">
                      <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                          class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachments-chat-${data.groupChat._id}">
                      <input type="file" id="attachments-chat-${data.groupChat._id}" name="my-attachments-chat"
                          class="attachments-chat chat-in-group" data-chat="${data.groupChat._id}">
                      <i class="fa fa-paperclip"></i>
                  </label>
                  <!-- <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${data.groupChat._id}" data-toggle="modal">
                              <i class="fa fa-video-camera"></i>
                          </a> -->
                  <input type="hidden" id="peer-id" value="">
                  <!-- <input type="button" value="sent"> -->
              </div>
          </div>
      </div>
      `;
  $('#screen-chat').append(rightSide);

  // 4. Kích hoạt changeScreenChat
  changeScreenChat();

  // 5. Kích hoạt imageModal và attachmentModal
  let imageModal = `
      <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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
          <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
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

  //   7. Kich hoat member modal
  let memberAdded = '';
  data.groupChat.members.forEach(function(member) {
    memberAdded += `
        <li data-uid="${member.userId}">
        <div class="contactPanelMember">
            <div class="user-avatar">
                <img src="images/users/${member.avatar}" alt="">
            </div>
            <div class="user-name">
                <span class="user-name">${member.username}</span>
            </div>
            <br>
        </div>
    </li>
    `
  });
  let memberModal = `
      <div class="modal fade" id="membersModal_${data.groupChat._id}" role="dialog">
      <div class="modal-dialog modal-lg">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                  <h4 class="modal-title">Quản lý thành viên</h4>
              </div>
              <div class="modal-body">
                    <div class="col-md-5 col-sm-12 find-user-add-to-group">
                        <div class="row form-search-to-add">
                            <div class="form-group">
                                <input type="text" class="form-control add-more-members" id="input-search-friends-to-add-group-chat_${data.groupChat._id}" placeholder="Tìm bạn bè để thêm vào nhóm" />
                                <span class="input-group-btn">
                                    <button class="btn btn-lg btn-add-more-members" type="button" id="btn-search-friends-to-add-group-chat_${data.groupChat._id}">
                                        <i class="glyphicon glyphicon-search"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                        <div class="row result-searched">
                            <ul id="group-chat-more-friends" class="${data.groupChat._id}"> 
                            </ul>
                        </div>
                    </div>

                    <div class="col-md-5 col-sm-12 list-user-added-member">
                        <ul id="friend-added">`+
                        
                          memberAdded +
                            
                        `</ul>
                        <div class="text-center" id="action-create-name-chat">
                            <br>
                            <button type="button" class="btn btn-primary" id="btn-save-group-chat">Thêm</button>
                            <button type="button" class="btn btn-danger" id="btn-cancel-group-chat">Hủy</button>
                        </div>
                    </div>
              </div>
          </div>
      </div>
    </div>
  `;
  $('body').append(memberModal);
  allowAddMoreFriendToGroup();
});

$(document).ready(function () {
  $('#input-search-friends-to-add-group-chat').bind('keypress', callSearchFriends);

  $('#btn-search-friends-to-add-group-chat').bind('click', callSearchFriends);

  callCreateGroupChat();
});

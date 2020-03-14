function addMoreFriendsToGroup(currentGroup) {
  $(`ul#group-chat-more-friends`).find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    let groupName = $(`#all-chat ul`).find(`li[data-chat=${currentGroup}] span.group-chat-name`).text().trim();
    $(this).remove();
    let friendHtml = $('ul#group-chat-more-friends').find(`div[data-uid=${uid}]`);
    let dataToPut = {
      memberId: friendHtml.data('uid'),
      memberAvatar: friendHtml.find('img').attr('src').split('/')[2],
      memberUsername: friendHtml.find('span.user-name').text()
    }
    let html = `
      <li data-uid="${dataToPut.memberId}">
          <div class="contactPanelMember">
              <div class="user-avatar">
                  <img src="images/users/${dataToPut.memberAvatar}" alt="">
              </div>
              <div class="user-name">
                  <span class="user-name">${dataToPut.memberUsername}</span>
              </div>
              <br>
          </div>
      </li>`;

    let promise = new Promise(function (resolve, reject) {
      $('ul#friend-added').append(html);
      // $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-more-friends').find(`div[data-uid=${uid}]`).remove();
    });

    $.ajax({
      url: '/group-chat/add-more-members',
      method: 'put',
      data: {
        groupId: currentGroup,
        member: dataToPut,
        messageVal: `Đã thêm ${dataToPut.memberUsername}`
      },
      success: function (data) {
        // 1. Đẩy dữ liệu ra client
        increaseNumberMessageGroup(currentGroup);

        $(`.right .chat[data-chat=${currentGroup}]`).append(
          `
          <div class="bubble me" data-mess-id="${data.message._id}">
            <img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>
            ${data.message.text}
          </div>
          `
        );

        // 1. Tăng số lượng member ở view
        $(`#screen-chat div[data-chat=${currentGroup}]`)
          .find('span.show-number-members')
          .text(
            parseInt($(`#screen-chat div[data-chat=${currentGroup}]`)
              .find('span.show-number-members')
              .text(), 10) + 1
          );

        // 2. Đổi dữ liệu tại preview và time
        $(`.person[data-chat=${currentGroup}]`)
          .find('.preview')
          .html(`<strong>Bạn</strong>: ${data.message.text}`);
        $(`.person[data-chat=${currentGroup}]`)
          .find('.time')
          .text(Math.floor((Date.now() - data.message.createdAt) / 1000) + ' giây');

        // 3. Đẩy cuộc hội thoại lên đầu
        $(`.person[data-chat=${currentGroup}]`).on('toTop.moveConversationToTheTop', function () {
          let dataToMove = $(this).parent();
          $(this).closest('ul').prepend(dataToMove);
          $(this).off('click.moveConversationToTheTop');
        });
        $(`.person[data-chat=${currentGroup}]`).trigger('toTop.moveConversationToTheTop');

        socket.emit('new-member-added', {
          groupId: currentGroup,
          member: dataToPut,
          message: data.message
        });
      }
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

function callSearchMoreFriends(element) {
  if (element.which === 13 || element.type === 'click') {
    let currentGroup = $(this).attr('id').split('_')[1];
    let keyword = $(`#input-search-friends-to-add-group-chat_${currentGroup}`).val();
    let memberIds = [];
    $(`#membersModal_${currentGroup} ul#friend-added`).find('li').each(function () {
      memberIds.push($(this).data('uid'));
    });

    if (!keyword.length) {
      alertify.notify('Bạn chưa nhập nội dung tìm kiếm', 'error', 5);
      return;
    }
    if (!keyword.match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{3,17}$/)) {
      alertify.notify('Tên cần tìm không cho phép các kí tự đặc biệt', 'error', 5);
      return;
    }

    $.get(`/contact/search-more-friends/${keyword}?memberIds=${memberIds}`, function (data) {
      $(`#membersModal_${currentGroup} ul#group-chat-more-friends`).html(data);
      // console.log(data);

      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addMoreFriendsToGroup(currentGroup);

      // // Action hủy việc tạo nhóm trò chuyện
      // cancelCreateGroup();
    });
  }
}

function allowAddMoreFriendToGroup() {
  $(`.add-more-members`).bind('keypress', callSearchMoreFriends);
  $(`.btn-add-more-members`).bind('click', callSearchMoreFriends);
}

socket.on('response-new-member-added', function (response) {
  let currentGroup = response.currentGroupId;

  if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
    // 1. Đẩy dữ liệu ra client
    increaseNumberMessageGroup(currentGroup);

    $(`.right .chat[data-chat=${currentGroup}]`).append(
      `
      <div class="bubble you" data-mess-id="${response.message._id}">
        <img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>
        ${response.message.text}
      </div>
      `
    );

    // 2. Tăng số lượng member ở view
    $(`#screen-chat div[data-chat=${currentGroup}]`)
      .find('span.show-number-members')
      .text(
        parseInt($(`#screen-chat div[data-chat=${currentGroup}]`)
          .find('span.show-number-members')
          .text(), 10) + 1
      );

    // 3. Đổi dữ liệu tại preview và time
    $(`.person[data-chat=${currentGroup}]`)
      .find('.preview')
      .html(`<strong>${response.message.sender.name}</strong>: ${response.message.text}`);
    $(`.person[data-chat=${currentGroup}]`)
      .find('.time')
      .text(Math.floor((Date.now() - response.message.createdAt) / 1000) + ' giây');

    // 4. Đẩy cuộc hội thoại lên đầu
    $(`.person[data-chat=${currentGroup}]`).on('toTop.moveConversationToTheTop', function () {
      let dataToMove = $(this).parent();
      $(this).closest('ul').prepend(dataToMove);
      $(this).off('click.moveConversationToTheTop');
    });
    $(`.person[data-chat=${currentGroup}]`).trigger('toTop.moveConversationToTheTop');
  }

  if (response.receiver.memberId == $('#dropdown-navbar-user').data('uid')) {
    location.reload();
  }
});

$(document).ready(function () {
  allowAddMoreFriendToGroup();
});

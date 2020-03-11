function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function (resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
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
      alertify.notify('Tên nhóm có độ dài từ 5 đến 30 kí tự và không chứa các kí tự đặc biệt', 'error', 5);
      return;
    }

    let arrIds = [];
    $('ul#friends-added').find('li').each(function (index, item) {
      arrIds.push({ 'userId': $(item).data('uid') })
    });
    arrIds.push({ 'userId': $('#dropdown-navbar-user').data('uid') });

    $.post('/group-chat/add-new', {
      arrIds: arrIds,
      groupName: groupName
    }, function (data) {
      console.log(data.groupChat);
    }).fail(function (response) {
      alertify.notify(response.responseText, 'error', 5);
    });
  });
}

$(document).ready(function () {
  $('#input-search-friends-to-add-group-chat').bind('keypress', callSearchFriends);

  $('#btn-search-friends-to-add-group-chat').bind('click', callSearchFriends);

  callCreateGroupChat();
});

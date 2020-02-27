function markAsReaded(targetUsers) {
  $.ajax({
    url: '/notification/mark-as-readed',
    method: 'put',
    data: { targetUsers: targetUsers },
    success: function(result) {
      if (result) {
        targetUsers.forEach(function(uid) {
          $('.noti_content').find(`div[data-uid=${uid}]`).removeClass('notif-readed-false');
          $('.list-notifications').find(`li>div[data-uid=${uid}]`).removeClass('notif-readed-false');
        });

        decreaseNumberNotification('noti_counter', targetUsers.length);
      }
    } 
  })
}

$(document).ready(function() {
  $('#popup_mark_as_read_modal').bind('click', function() {
    let targetUsers = [];
    $('.list-notifications').find('li>div.notif-readed-false').each(function(index, notification) {
      targetUsers.push($(notification).data('uid'));
    });
    if (targetUsers.length === 0) {
      alertify.notify('Bạn không còn thông báo nào chưa đọc', 'error', 5);
      return;
    }
    markAsReaded(targetUsers);
  });
  
  $('#popup_mark_as_read').bind('click', function() {
    let targetUsers = [];
    $('.noti_content').find('div.notif-readed-false').each(function(index, notification) {
      targetUsers.push($(notification).data('uid'));
    });
    if (targetUsers.length === 0) {
      alertify.notify('Bạn không còn thông báo nào chưa đọc', 'error', 5);
      return;
    }
    markAsReaded(targetUsers);
  })
});


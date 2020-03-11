function removeContact() {
  $('.user-remove-contact').unbind('click').on('click', function() {
    let targetId = $(this).data('uid');
    Swal.fire({
		  title: 'Xoá danh bạ',
		  html: `Bạn có đồng ý xoá <strong>${$(this).parent().find('div.user-name p').text()}</strong> khỏi danh bạ này không không?`,
      icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#2ACC77',
		  cancelButtonColor: '#ff7675',
		  confirmButtonText: 'Có',
		  cancelButtonText: 'Không'
		}).then((result) => {
      // result: 
      // confirm => value: true
      // cancel => dismiss: 'cancel'
		  if (result.value) {
        $.ajax({
          url: '/contact/remove-contact',
          method: 'delete',
          data: { uid: targetId },
          success: function(result) {
            if (result.success) {
              // 1. Giảm số lượng danh bạ
              decreaseNumberNotifContact('count-contacts');
              // 2. Xoá danh bạ khỏi màn hình danh bạ
              $('#contacts ul.contactList').find(`li[data-uid=${targetId}]`).remove();
              // 3. Emit sự kiện lên server
              socket.emit('remove-contact', { contactId: targetId });

              // Xử lý realtime chat khi xoá danh bạ
              // 1. Xoá khỏi leftSide
              $(`#all-chat ul`).find(`li[data-chat=${targetId}]`).parent().remove();
              $(`#user-chat ul`).find(`li[data-chat=${targetId}]`).parent().remove();

              // 2. Xoá khỏi rightSide
              $('#screen-chat').find(`div[data-chat=${targetId}]`).remove();

              // 3. Chuyển hướng sang màn hình chat tiếp theo
              if ($('#select-type-chat').val() === 'all-chat') {
                if ($('#all-chat ul').find('li').length > 0) 
                  $('#all-chat ul').find('li')[0].click();
              }
              if ($('#select-type-chat').val() === 'user-chat') {
                if ($('#user-chat ul').find('li').length > 0) 
                  $('#user-chat ul').find('li')[0].click();
              }
            }
          }
        });
		  } else {
		  	return;
		  }
		}); 
  })
}

socket.on('response-remove-contact', function(user) {
  // 1. Giảm số lượng danh bạ
  decreaseNumberNotifContact('count-contacts');
  // 2. Xoá danh bạ khỏi màn hình danh bạ
  $('#contacts ul.contactList').find(`li[data-uid=${user.id}]`).remove();

  // Xử lý realtime chat khi xoá danh bạ
  // 1. Xoá khỏi leftSide
  $(`#all-chat ul`).find(`li[data-chat=${user.id}]`).parent().remove();
  $(`#user-chat ul`).find(`li[data-chat=${user.id}]`).parent().remove();

  // 2. Xoá khỏi rightSide
  $('#screen-chat').find(`div[data-chat=${user.id}]`).remove();

  // 3. Chuyển hướng sang màn hình chat tiếp theo
  if ($('#select-type-chat').val() === 'all-chat') {
    if ($('#all-chat ul').find('li').length > 0) 
      $('#all-chat ul').find('li')[0].click();
  }
  if ($('#select-type-chat').val() === 'user-chat') {
    if ($('#user-chat ul').find('li').length > 0) 
      $('#user-chat ul').find('li')[0].click();
  }
});

$(document).ready(function() {
  removeContact();
})

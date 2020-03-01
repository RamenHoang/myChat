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
});

$(document).ready(function() {
  removeContact();
})

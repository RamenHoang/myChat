function removeReceived(targetId) {
	$.ajax({
		url: '/contact/remove-request-contact-received',
		type: 'delete',
		data: { uid: targetId },
		success: function(data) {
			if (data.success) {
				// Bớt ở tab "Yêu cầu kết bạn"
				decreaseNumberNotifContact('count-request-contact-received');

				// Bớt ở navbar
				decreaseNumberNotification('noti_contact_counter', 1);

				// Xoá ở tab "Yêu cầu kết bạn"
	      $('#request-contact-received').find(`li[data-uid=${targetId}]`).remove();

				socket.emit('remove-request-contact-received', { contactId: targetId });
			}
		}
	});
}

function removeRequestContactReceived() {
	$('.user-reject-request-contact-received').unbind('click').on('click', function() {
    let targetId = $(this).data('uid');
    console.log('clicked');
		removeReceived(targetId);
	});
}

socket.on('response-remove-request-contact-received', function(user) {
  $('#find-user').find(`div.user-add-new-contact[data-uid=${user.id}]`).css('display', 'inline-block');
  $('#find-user').find(`div.user-remove-request-contact-sent[data-uid=${user.id}]`).hide();
  
	$('.noti_content').find(`div[data-uid=${user.id}]`).remove();
	$('.list-notifications').find(`li div[data-uid=${user.id}]`).parent().remove();
	
  // Xoá ở tab "Đang chờ xác nhận"
  $('#request-contact-sent').find(`li[data-uid=${user.id}]`).remove();

	decreaseNumberNotifContact('count-request-contact-sent');
	decreaseNumberNotification('noti_contact_counter', 1);
	decreaseNumberNotification('noti_counter', 1);
});

$(document).ready(function() {
	removeRequestContactReceived();
});

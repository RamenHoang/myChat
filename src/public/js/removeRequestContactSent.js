function removeSent(targetId) {
	$.ajax({
		url: '/contact/remove-request-contact-sent',
		type: 'delete',
		data: { uid: targetId },
		success: function(data) {
			if (data.success) {
				$('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block');
				$('#find-user').find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).hide();

				// Bớt ở tab "Đang chờ xác nhận"
				decreaseNumberNotifContact('count-request-contact-sent');

				// Bớt ở navbar
				decreaseNumberNotification('noti_contact_counter', 1);

				// Xoá ở tab "Đang chờ xác nhận"
				$('#request-contact-sent').find(`li[data-uid=${targetId}]`).remove();

				socket.emit('remove-request-contact-sent', { contactId: targetId });
			}
		}
	});
}

function removeRequestContactSent() {
	$('.user-remove-request-contact-sent').unbind('click').on('click', function() {
		let targetId = $(this).data('uid');
		removeSent(targetId);
	});

	$('.user-remove-request-sent').unbind('click').on('click', function() {
		let targetId = $(this).data('uid');
		removeSent(targetId);
	});
}

socket.on('response-remove-request-contact-sent', function(user) {
	$('.noti_content').find(`div[data-uid=${user.id}]`).remove();
	$('.list-notifications').find(`li div[data-uid=${user.id}]`).parent().remove();
	// Xoá ở tab "Yêu cầu kết bạn"
	$('#request-contact-received').find(`li[data-uid=${user.id}]`).remove();

	decreaseNumberNotifContact('count-request-contact-received');
	decreaseNumberNotification('noti_contact_counter', 1);
	decreaseNumberNotification('noti_counter', 1);
});

$(document).ready(function() {
	removeRequestContactSent();
});

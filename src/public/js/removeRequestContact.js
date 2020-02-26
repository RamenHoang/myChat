function decreaseNumberNotifContact(classname) {
	let currentValue = parseInt($(`.${classname}`).find('em').text(), 10);
	currentValue--;
	if (currentValue === 0) {
		$(`.${classname}`).html(null);
	} else {
		$(`.${classname}`).html(`(<em>${currentValue}</em>)`);
	}
}

function removeRequestContact() {
	$('.user-remove-request-contact').bind('click', function() {
		let targetId = $(this).data('uid');
		
		$.ajax({
			url: '/contact/remove-request-contact',
			type: 'delete',
			data: { uid: targetId },
			success: function(data) {
				if (data.success) {
					$('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block');
					$('#find-user').find(`div.user-remove-request-contact[data-uid=${targetId}]`).hide();
					decreaseNumberNotifContact('count-request-contact-sent')
				}
			}
		})
	});
}

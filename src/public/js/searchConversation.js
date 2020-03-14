function clickToChat() {
	let conversations = $('#search-results').find('li');
	if (conversations.length === 0) {
		alertify.notify('Không tìm được dữ liệu liên quan', 'error', 5);
		return;
	}
	conversations.each(function() {
		$(this).on('click', function() {
			let targetId = $(this).data('uid');
			let isGroup = $(this).hasClass('is-group');

			if ($('#all-chat ul').find(`li[data-chat=${targetId}]`).length > 0) {
				$('#all-chat ul').find(`li[data-chat=${targetId}]`).click();
			} else {
				$.get(`/message/get-conversation-with-message?targetId=${targetId}&isGroup=${isGroup}`, function(data) {
					// 1. Render leftSide
					$('#all-chat').find('ul').prepend(data.leftSideData);
					// Cho phép thay đổi màn hình chat và kích hoạt các tính năng chat
					changeScreenChat();
					// Cấu hình thanh cuộn trái
					resizeScrollLeft();
					nineScrollLeft();
					// ---------------------------------------------------
	
	
					// 2. Render rightSide
					$('#screen-chat').append(data.rightSideData);
					// Kích hoatj xem thêm tin nhắn
					readMoreMessage();
					// Cho phép xem hình ảnh
					showImage();
					// ---------------------------------------------------
	
	
					// 3. Render imageModal
					$('body').append(data.imageModalData);
					// Sắp xếp lại ảnh trong imageModal
					gridPhotos(5);
					// ---------------------------------------------------
	
	
					// 4. Render attachmentModal
					$('body').append(data.attachmentModalData);
					// ---------------------------------------------------
	
					// 5. Kiểm tra online-offline
					socket.emit('check-onoff');

					

					// 6. Chuyển màn hình chat sang cuộc trò truyện này ngay
					$('#all-chat ul').find(`li[data-chat=${targetId}]`).click();

					allowAddMoreFriendToGroup();
				});
			}

			// 7. clear input
			$('#searchBox').val(null);
		})
	})
}

function callSearchConversation(element) {
	if (element.which === 13 || element.type === 'click') {
		let keyword = $('#searchBox').val();
		
		if (!keyword.length) {
			alertify.notify('Bạn chưa nhập nội dung tìm kiếm', 'error', 5);
			return;
		}
		if (!keyword.match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{3,17}$/)) {
			alertify.notify('Tên cần tìm không cho phép các kí tự đặc biệt', 'error', 5);
			return;
		}

		$.get(`/contact/findConversations/${keyword}`, function(data) {
			// 1. Render 
			$('#search-results ul').html(data);
			$('#search-results').css('display', 'block');

			// 2. Click vào tên cuộc trò truyện để chat
			clickToChat();

			// 3. Click ra ngoài để đóng dropdown list
			$('.main-content').click(function () {
				$('#search-results').fadeOut('fast', 'linear');
			});
		})
	}
}


$(document).ready(function() {
	$('#searchBox').bind('keypress', callSearchConversation);
});

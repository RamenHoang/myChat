function imageChat(chatId) {
  $(`#image-chat-${chatId}`).unbind('change').on('change', function () {
    let fileData = $(this).prop('files')[0];
    let match = ['image/png', 'image/jpg', 'image/jpeg'];
    let limit = 1048576; // byte = 1mb

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify('Kiểu file không hợp lệ. Chỉ chấp nhận jpg hoặc png', 'error', 5);
      $(this).val(null);
      return false;
    }
    if (fileData.size > limit) {
      alertify.notify('Ảnh có dung lượng tối đa là 1MB', 'error', 5);
      $(this).val(null);
      return false;
    }

    let targetId = $(this).data('chat');

    let imageFormData = new FormData();
    imageFormData.append('my-image-chat', fileData);
    imageFormData.append('uid', targetId);

    if ($(this).hasClass('chat-in-group')) {
      imageFormData.append('isChatGroup', true);
    }

    $.ajax({
			url: '/message/add-new-image',
			type: 'post',
			cache: false,
			contentType: false,
			processData: false,
			data: imageFormData,
			success: function(result) {
				console.log(result);
			},
			error: function(err) {
				alertify.notify(err.responseText, 'error', 5);
			}
		});
  })
}

$(document).ready(function() {
  imageChat();
});

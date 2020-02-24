let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;

function updateUserInfo() {
	$('#input-change-avatar').bind('change', function() {
		let fileData = $(this).prop('files')[0];
		let match = [ 'image/png', 'image/jpg', 'image/jpeg' ];
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

		if (typeof FileReader != 'undefined') {
			let imagePreview = $('#image-edit-profile');
			imagePreview = imagePreview.empty();

			let fileReader = new FileReader();
			fileReader.onload = function(element) {
				$('<img>', {
					'src': element.target.result,
					'class': 'avatar img-circle',
					'id': 'input-change-avatar',
					'alt': 'avatar'
				}).appendTo(imagePreview);
			}

			imagePreview.show();
			fileReader.readAsDataURL(fileData);

			let formData = new FormData();
			formData.append('avatar', fileData);
			userAvatar = formData;

		} else {
			alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader', 'error', 7);
			return false;
		}
	});

	$('#input-change-username').bind('change', function() {
		userInfo.username = $(this).val();
	});

	$('#input-change-gender-male').bind('click', function() {
		userInfo.gender = $(this).val();
	});

	$('#input-change-gender-male').bind('click', function() {
		userInfo.gender = $(this).val();
	});

	$('#input-change-address').bind('change', function() {
		userInfo.address = $(this).val();
	});

	$('#input-change-phone').bind('change', function() {
		userInfo.phone = $(this).val();
	});

}

$(document).ready(function() {
	updateUserInfo();

	originAvatarSrc = $('#user-modal-avatar').attr('src')

	$('#input-btn-update-user').bind('click', function() {
		if ($.isEmptyObject(userInfo) && !userAvatar) {
			alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu', 'error', 5);
			return false;
		}
		
		// Send a ajax request to server
		$.ajax({
			url: '/user/update-avatar',
			type: 'put',
			cache: false,
			contentType: false,
			processData: false,
			data: userAvatar,
			success: function(result) {
				$('.user-modal-alert-success').css('display', 'none');
				$('.user-modal-alert-error').css('display', 'none');
				// Display success
				$('.user-modal-alert-success').find('span').text(result.message);
				$('.user-modal-alert-success').css('display', 'block');

				// Update avatar at navbar
				$('#navbar-avatar').attr('src', result.imageSrc);

				// Update origin avatar src in front end
				originAvatarSrc = result.imageSrc;
				$('#input-btn-cancel-update-user').click();

				// Refesh all
				$('#input-btn-cancel-update-user').click();
			},
			error: function(err) {
				$('.user-modal-alert-success').css('display', 'none');
				$('.user-modal-alert-error').css('display', 'none');
				// Display error
				$('.user-modal-alert-error').find('span').text(err.responseText);
				$('.user-modal-alert-error').css('display', 'block');

				// Refesh all
				$('#input-btn-cancel-update-user').click();
			}
		})
	});

	$('#input-btn-cancel-update-user').bind('click', function() {
		userAvatar = null;
		userInfo = {};
		$('#input-change-avatar').val(null);
		$('#user-modal-avatar').attr('src', originAvatarSrc);
	})
})

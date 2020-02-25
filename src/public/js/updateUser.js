// User info
let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};

// User password
let userUpdatePassword = {};

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
		if ($(this).val().match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{3,17}$/)) {
			userInfo.username = $(this).val();
			return;
		}
		alertify.notify('Username giới hạn trong vòng 3 - 17 kí tự và không chứa kí tự đặc biệt', 'error', 5);
		$(this).val(originUserInfo.username);
		delete userInfo.username;
	});

	$('#input-change-gender-male').bind('click', function() {
		if ($(this).val() === 'male') {
			userInfo.gender = $(this).val();
			return;
		}
		alertify.notify('Bạn thuộc giới tính nào vậy? :D', 'error', 5);
		if (originUserInfo.gender === 'male') $(this).click();
		delete userInfo.gender;
	});

	$('#input-change-gender-female').bind('click', function() {
		if ($(this).val() === 'female') {
			userInfo.gender = $(this).val();
			return;
		}
		alertify.notify('Bạn thuộc giới tính nào vậy? :D', 'error', 5);
		if (originUserInfo.gender === 'female') $(this).click();
		delete userInfo.gender;
	});

	$('#input-change-address').bind('change', function() {
		if ($(this).val().match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ \/\-\,]{3,60}$/)) {
			userInfo.address = $(this).val();
			return;
		}
		alertify.notify('Địa chỉ giới hạn trong vòng 3 - 60 kí tự, chỉ được phép chứa các kí tự \/ \, \-', 'error', 5);
		$(this).val(originUserInfo.address);
		delete userInfo.address;
	});

	$('#input-change-phone').bind('change', function() {
		if ($(this).val().match(/^(0)[0-9]{9}$/)) {
			userInfo.phone = $(this).val();
			return;
		}
		alertify.notify('Số điện thoại chỉ có độ dài là 10 số', 'error', 5);
		$(this).val(originUserInfo.phone);
		delete userInfo.phone;
	});

	$('#input-change-current-password').bind('change', function() {
		if ($(this).val().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/)) {
			userUpdatePassword.currentPassword = $(this).val();
			return;
		}
		alertify.notify('Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số', 'error', 5);
		delete userUpdatePassword.currentPassword;
		$(this).val(null);
	});

	$('#input-change-new-password').bind('change', function() {
		if ($('#input-change-current-password').val().trim() === '') {
			alertify.notify('Vui lòng nhập mật khẩu hiện tại', 'error', 5);
			$('#input-change-current-password').focus();
			return;
		}
		if ($(this).val().match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}$/)) {
			if ($(this).val() === $('#input-change-current-password').val()) {
				alertify.notify('Mật khẩu mới không được phép trùng với mật khẩu cũ', 'error', 5);
				return;
			}
			userUpdatePassword.newPassword = $(this).val();
			return;
		}
		alertify.notify('Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số', 'error', 5);
		delete userUpdatePassword.newPassword;
		$(this).val(null);
	});

	$('#input-change-confirm-password').bind('change', function() {
		if ($('#input-change-new-password').val().trim() === '') {
			alertify.notify('Vui lòng nhập mật khẩu mới', 'error', 5);
			$('#input-change-new-password').focus();
			return;
		}
		if ($(this).val() === $('#input-change-new-password').val()) {
			userUpdatePassword.confirmPassword = $(this).val();
			return;
		}
		alertify.notify('Nhập lại mật khẩu chưa chính xác', 'error', 5);
		delete userUpdatePassword.confirmPassword;
		$(this).val(null);
	});
}

function callUpdateUserAvatar() {
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
		});
}

function callUpdateUserInfo() {
	$.ajax({
			url: '/user/update-info',
			type: 'put',
			data: userInfo,
			success: function(result) {
				$('.user-modal-alert-success').css('display', 'none');
				$('.user-modal-alert-error').css('display', 'none');
				// Display success
				$('.user-modal-alert-success').find('div').text(result.message);
				$('.user-modal-alert-success').css('display', 'block');

				// Update origin user info
				originUserInfo = Object.assign(originUserInfo, userInfo);

				// Update username at navbar
				$('#navbar-username').text(originUserInfo.username);
				
				// Refesh all
				$('#input-btn-cancel-update-user').click();
			},
			error: function(err) {
				$('.user-modal-alert-success').css('display', 'none');
				$('.user-modal-alert-error').css('display', 'none');
				// Display error
				$('.user-modal-alert-error').find('div').text(err.responseText);
				$('.user-modal-alert-error').css('display', 'block');
				// Refesh all
				$('#input-btn-cancel-update-user').click();
			}
		});
}

function callUpdateUserPassword() {
	$.ajax({
			url: '/user/update-password',
			type: 'put',
			data: userUpdatePassword,
			success: function(result) {
				$('.password-modal-alert-success').css('display', 'none');
				$('.password-modal-alert-error').css('display', 'none');
				// Display success
				$('.password-modal-alert-success').find('div').text(result.message);
				$('.password-modal-alert-success').css('display', 'block');
				// Refesh all
				$('#input-btn-cancel-update-password').click();
				callLogout();
			},
			error: function(err) {
				$('.password-modal-alert-success').css('display', 'none');
				$('.password-modal-alert-error').css('display', 'none');
				// Display error
				$('.password-modal-alert-error').find('div').text(err.responseText);
				$('.password-modal-alert-error').css('display', 'block');
				// Refesh all
				$('#input-btn-cancel-update-password').click();
			}
		});
}

function callLogout() {
	let timerInterval;
	Swal.fire({
	  position: 'top-end',
	  title: 'Tài khoản của bạn sẽ đăng xuất sau 5 giây!',
	  showConfirmButton: false,
	  timer: 5000
	})
		.then(result => {
			$.get('/logout', () => {
				location.reload();
			});
		});
}

$(document).ready(function() {
	originAvatarSrc = $('#user-modal-avatar').attr('src')
	originUserInfo = {
		username: $('#input-change-username').val(),
		gender: $('#input-change-gender-male').is(':checked') ? $('#input-change-gender-male').val() : $('#input-change-gender-female').val(),
		address: $('#input-change-address').val(),
		phone: $('#input-change-phone').val()
	}

	// Update user info after changing value
	updateUserInfo();

	$('#input-btn-update-user').bind('click', function() {
		if ($.isEmptyObject(userInfo) && !userAvatar) {
			alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu', 'error', 5);
			return false;
		}
		
		if (userAvatar) {
			// Send a ajax request to server
			callUpdateUserAvatar();
		}

		if (!$.isEmptyObject(userInfo)) {
			callUpdateUserInfo();
		}
	});

	$('#input-btn-cancel-update-user').bind('click', function() {
		userAvatar = null;
		userInfo = {};
		$('#input-change-avatar').val(null);
		$('#user-modal-avatar').attr('src', originAvatarSrc);
		$('#input-change-username').val(originUserInfo.username)
		originUserInfo.gender === $('#input-change-gender-male').val() ? $('#input-change-gender-male').click() : $('#input-change-gender-female').click();
		$('#input-change-address').val(originUserInfo.address);
		$('#input-change-phone').val(originUserInfo.phone);
	})

	$('#input-btn-update-password').bind('click', function() {
		if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmPassword) {
			alertify.notify('Vui lòng nhập đủ thông tin trước khi cập nhật', 'error', 5);
			return;
		}
		Swal.fire({
		  title: 'Đổi mật khẩu',
		  text: "Bạn có đồng ý thay đổi mật khẩu không?",
		  icon: 'warning',
		  showCancelButton: true,
		  confirmButtonColor: '#3085d6',
		  cancelButtonColor: '#d33',
		  confirmButtonText: 'Có',
		  cancelButtonText: 'Không'
		}).then((result) => {
			console.log(result);
		  if (result.value) {
		  	callUpdateUserPassword();
		  } else {
		  	$('#input-btn-cancel-update-password').click();
		  	return;
		  }
		})
	});

	$('#input-btn-cancel-update-password').bind('click', function() {
		userUpdatePassword = {};
		$('#input-change-confirm-password').val(null);
		$('#input-change-new-password').val(null);
		$('#input-change-current-password').val(null);
	});
})

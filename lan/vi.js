export const transValidation = {
	email_incorrect: 'Email phải có dạng example@gmail.com!',
	gender_incorrect: 'Bạn thuộc giới tính thứ 3 à :D',
	password_incorrect: 'Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số',
	password_confirmation_incorrect: 'Nhập lại mật khẩu chưa chính xác',
	update_username: 'Username giới hạn trong vòng 3 - 17 kí tự và không chứa kí tự đặc biệt',
	update_gender: 'Bạn thuộc giới tính nào vậy? :D',
	update_address: 'Địa chỉ giới hạn trong vòng 3 - 30 kí tự',
	update_phone: 'Số điện thoại chỉ có độ dài là 10 số',
	new_password_invalid: 'Mật khẩu mới không được trùng với mật khẩu cũ',
	keyword_find_user: 'Lỗi kí tự tìm kiếm. Chỉ cho phép chữ cái và số',
	message_text_emoji_incorrect: 'Tin nhắn không hợp lệ. Đảm bảo tối thiểu 1 kí tự. Tối đa 400 kí tự.'
};

export const transErrors = {
	email_in_use: 'Email này đã được sử dụng!',
	email_is_removed: 'Email này đã bị xoá!',
	email_is_not_actived: (email) => `Email này chưa được kích hoạt. Vui lòng kích hoạt tài khoản tại email <strong>${email}</strong>!`,
	email_is_actived: 'Email này đã được kích hoạt từ trước!',
	login_failed: 'Sai tài khoản hoặc mật khẩu!',
	server_error: 'Có lỗi phía server!',
	avatar_type: 'Kiểu file không hợp lệ. Chỉ chấp nhận jpg hoặc png',
	avatar_size: 'Ảnh có dung lượng tối đa là 1MB',
	account_undefined: 'Tài khoản không tồn tại',
	current_password_not_match: 'Mật khẩu hiện tại không chính xác',
	conversation_not_found: 'Cuộc trò chuyện không tồn tại!'
}

export const transSuccess = {
	register_success: (email) => `Tài khoản <strong>${email}</strong> đã được tạo. Vui lòng kích hoạt tài khoản tại email <strong>${email}</strong>!`,
	account_actived: 'Kích hoạt tài khoản thành công! Bạn đã có thể đăng nhập vào myChat',
	login_success: (username) => 	`Xin chào ${username}, chúc một ngày tốt lành!`,
	logout_success: 'Đăng xuất tài khoản thành công. Hẹn gặp lại!',
	info_updated: 'Cập nhật thông tin thành công!',
	password_updated: 'Cập nhật mật khẩu thành công!'
}

export const transMail = {
	subject: 'myChat: Xác nhận kích hoạt tài khoản',
	template: (verifyLink) => `
		<h2>Bạn nhận được email này vì đã đăng ký sử dụng ứng dụng myChat</h2>
		<h3>Vui lòng click vào liên kết bên dưới để xác nhận kích hoạt tài khoản</h3>
		<h3><a href='${verifyLink}' target='blank'>${verifyLink}</a></h3>
		<h4>Cảm ơn bạn đã sử dụng myChat :D <3</h4>
	`,
	send_failed: 'Có lỗi trong quá trình gửi email'
}

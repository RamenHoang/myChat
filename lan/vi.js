export const transValidation = {
	email_incorrect: 'Email phải có dạng example@gmail.com!',
	gender_incorrect: 'Bạn thuộc giới tính thứ 3 à :D',
	password_incorrect: 'Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số',
	password_confirmation_incorrect: 'Nhập lại mật khẩu chưa chính xác'
};

export const transErrors = {
	email_in_use: 'Email này đã được sử dụng!',
	email_is_removed: 'Email này đã bị xoá!',
	email_is_not_actived: (email) => `Email này chưa được kích hoạt. Vui lòng kích hoạt tài khoản tại email <strong>${email}</strong>!`,
	email_is_actived: 'Email này đã được kích hoạt từ trước!',
	login_failed: 'Sai tài khoản hoặc mật khẩu!',
	server_error: 'Có lỗi phía server!'
}

export const transSuccess = {
	register_success: (email) => `Tài khoản <strong>${email}</strong> đã được tạo. Vui lòng kích hoạt tài khoản tại email <strong>${email}</strong>!`,
	account_actived: 'Kích hoạt tài khoản thành công! Bạn đã có thể đăng nhập vào myChat',
	login_success: (username) => 	`Xin chào ${username}, chúc một ngày tốt lành!`,
	logout_success: 'Đăng xuất tài khoản thành công. Hẹn gặp lại!'
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

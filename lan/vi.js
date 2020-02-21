export const transValidation = {
	email_incorrect: 'Email phải có dạng example@gmail.com!',
	gender_incorrect: 'Bạn thuộc giới tính thứ 3 à :D',
	password_incorrect: 'Mật khẩu phải chứa ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số',
	password_confirmation_incorrect: 'Nhập lại mật khẩu chưa chính xác'
};

export const transErrors = {
	email_in_use: 'Email này đã được sử dụng!',
	email_is_removed: 'Email này đã bị xoá!',
	email_is_not_actived: (email) => `Email này chưa được kích hoạt. Vui lòng kích hoạt tài khoản tại email <strong>${email}</strong>!`
}

export const transSuccess = {
	register_success: (email) => `Tài khoản <strong>${email}</strong> đã được tạo. Vui lòng kích hoạt tài khoản tại email <strong>${email}</strong>!`
}

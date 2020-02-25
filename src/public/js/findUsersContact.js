function callFindUsers(element) {
	if (element.which === 13 || element.type === 'click') {
		let keyword = $('#input-find-users-contact').val();
		
		if (!keyword.length) {
			alertify.notify('Bạn chưa nhập nội dung tìm kiếm', 'error', 5);
			return;
		}
		if (!keyword.match(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]{3,17}$/)) {
			alertify.notify('Tên cần tìm không cho phép các kí tự đặc biệt', 'error', 5);
			return;
		}

		$.get(`/contact/find-users/${keyword}`, function(data) {
			$('#find-user ul').html(data);
		})
	}
}


$(document).ready(function() {
	$('#input-find-users-contact').bind('keypress', callFindUsers);

	$('#btn-find-users-contact').bind('click', callFindUsers)
});

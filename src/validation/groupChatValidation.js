import { check } from 'express-validator/check';
import { transValidation } from '../../lan/vi';

let addNewGroup = [
	check('arrIds', transValidation.add_new_group_users_incorrect)
		.custom(arrIds => {
      if (!Array.isArray(arrIds)) {
        return false;
      }
      if (arrIds.length < 2) {
        return false;
      }
      return true;
    }),
    check('groupName', transValidation.add_new_group_name_incorrect)
		.isLength({ min: 3, max: 30 })
		.matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/)
];

module.exports = {
	addNewGroup: addNewGroup
}
import UserModel from '../models/userModel';

/**
 * [Update user info]
 * @param  {[string]} id   [id of user]
 * @param  {[Object]} item [info is to be updating]
 * @return {[type]}      [description]
 */
let updateUser = (id, item) => {
	return UserModel.updateUser(id, item);
}

module.exports = {
	updateUser: updateUser
}

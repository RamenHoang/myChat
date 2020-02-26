import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';

/**
 * Get notifications  when reload
 * Just fetch 10 notifications one time
 * @param {String} currentUserId 
 * @param {Number} limit 
 */
let getNotifications = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, limit);
      
      notifications = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(sender._id, sender.username, sender.avatar, notification.type, notification.isRead);
      })
      resolve(await Promise.all(notifications));
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getNotifications: getNotifications
}

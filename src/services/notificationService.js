import NotificationModel from '../models/notificationModel';
import UserModel from '../models/userModel';

/**
 * Get notifications  when reload
 * Just fetch 10 notifications one time
 * @param {String} currentUserId 
 * @param {Number} limit 
 */
let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId);
      
      notifications = notifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(sender._id, sender.username, sender.avatar, notification.type, notification.isRead);
      });
      resolve(await Promise.all(notifications));
    } catch (error) {
      reject(error);
    }
  });
}

let countUnreaded = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await NotificationModel.model.countUnreaded(currentUserId));
    } catch (error) {
      reject(error);
    }
  });
}

let readMore = (userId, skipNumberNotification) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotifications = await NotificationModel.model.readMore(userId, skipNumberNotification);

      newNotifications = newNotifications.map(async (notification) => {
        let sender = await UserModel.findUserById(notification.senderId);
        return NotificationModel.contents.getContent(sender._id, sender.username, sender.avatar, notification.type, notification.isRead);
      });

      resolve(await Promise.all(newNotifications));
    } catch (error) {
      console.log('service: ', error);
      reject(error);
    }
  });
}

let markAsReaded = (userId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await NotificationModel.model.markAsReaded(userId, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(`Error when mark as read: ${error}`);
      reject(false);
    }
  });
}

module.exports = {
  getNotifications: getNotifications,
  countUnreaded: countUnreaded,
  readMore: readMore,
  markAsReaded: markAsReaded
}

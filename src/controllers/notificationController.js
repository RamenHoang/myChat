import { notification } from '../services/services';

let readMore = async (req, res) => {
  try {
    let skipNumberNotification = parseInt(req.query.skipNumber, 10);
    if (!skipNumberNotification) skipNumberNotification = 0;

    let newNotifications = await notification.readMore(req.user._id, skipNumberNotification);

    res.status(200).send(newNotifications);
  } catch (error) {
    console.log('controller: ', error);
    return res.status(500).send(error);
  }
}

let markAsReaded = async (req, res) => {
  try {
    let mark = await notification.markAsReaded(req.user._id, req.body.targetUsers);
    return res.status(200).send(mark);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  readMore: readMore,
  markAsReaded: markAsReaded
}

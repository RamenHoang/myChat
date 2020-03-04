export const bufferToBase64 = (buffer) => {
  return Buffer.from(buffer).toString('base64');
};

export const getLastMessage = (messages, userId) => {
  if (!messages.length) return '';
  let lastMes = messages[messages.length - 1];
  if (lastMes.messageType === 'text') {
    if (lastMes.senderId == userId) return `<strong>Bạn</strong>: ${lastMes.text}`;
    return `<strong>${lastMes.sender.name}</strong>: ${lastMes.text}`;
  }
  if (lastMes.messageType === 'image') {
    if (lastMes.senderId == userId) return 'Bạn đã gửi một ảnh';
    return `<strong>${lastMes.sender.name}</strong> đã gửi một ảnh`;
  }
  if (lastMes.messageType === 'file') {
    if (lastMes.senderId == userId) return 'Bạn đã gửi một file';
    return `<strong>${lastMes.sender.name}</strong> đã gửi một file`;
  }
}

export const getDuration = (messages) => {
  if (!messages.length) return '';
  let lastMes = messages[messages.length - 1];
  let timeAgo = Date.now() - lastMes.createdAt;
  timeAgo /= 1000;
  if (timeAgo > 1 && timeAgo < 59) return `${Math.floor(timeAgo)} giây`;
  else if (timeAgo / 60 > 1 && timeAgo / 60 < 59) return `${Math.floor(timeAgo / 60)} phút`;
  else if (timeAgo / 3600 > 1 && timeAgo / 3600 < 23) return `${Math.floor(timeAgo / 3600)} giờ`;
  return `${Math.floor(timeAgo / 3600 / 24)} ngày`;
}

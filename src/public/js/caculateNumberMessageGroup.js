function increaseNumberMessageGroup(chatId) {
  let currentValue = +$(`.right[data-chat=${chatId}]`).find('span.show-number-messages').text();
  currentValue++;
  $(`.right[data-chat=${chatId}]`).find('span.show-number-messages').text(currentValue);
}

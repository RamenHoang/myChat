$(document).ready(function() {
  $('#link-read-more-notif').bind('click', function() {
    let skipNumber = $('ul.list-notifications').find('li').length;

    $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
      if (notifications.length === 0) {
        alertify.notify('Bạn không còn thông báo nào để tải xem thêm', 'error', 5);
        return;
      }
      notifications.forEach(function(notification) {
        $('ul.list-notifications').append(`<li>${notification}</li>`);
      });
    });
  })
});


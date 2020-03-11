/**
 * Created by https://trungquandev.com's author on 25/02/2018.
 */
const socket = io();

function flashMasterNotify() {
  let notify = $('.master-success-message').text();
  if (notify.length) {
    alertify.notify(notify, 'success', 5);
  }
}

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop($(`.right .chat[data-chat=${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(chatId) {
  $(`#write-chat-${chatId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        // Gán giá trị vào thẻ input chính đã bị ẩn
        $(`#write-chat-${chatId}`).val(this.getText());
      },
      click: function() {
        textAndEmojiChat(chatId);
        typing(chatId);
      },
      blur: function () {
        typingOff(chatId);
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $('.main-content').click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $('.show-images').unbind('click').on('click', function () {
    let modalId = $(this).attr('href');

    let originDataImage = $(`${modalId}`).find('div.modal-body').html();

    let countRows = Math.ceil($(`${modalId}`).find('div.all-images img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`${modalId}`).find('div.all-images').photosetGrid({
      highresLinks: true,
      rel: 'withhearts-gallery',
      gutter: '2px',
      layout: layoutStr,
      onComplete: function () {
        $(`${modalId}`).find('.all-images').css({
          'visibility': 'visible'
        });
        $(`${modalId}`).find('.all-images a').colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '90%',
          maxWidth: '90%'
        });
      }
    });

    // Bắt sự kiện đóng modal
    $(`${modalId}`).on('hidden.bs.modal', function() {
      $(this).find('div.modal-body').html(originDataImage);
    });
  });
}

function changeTypeChat() {
  $('#select-type-chat').bind('change', function () {
    let optionSelected = $('option:selected', this);
    optionSelected.tab('show');

    if ($(this).val() === 'user-chat') {
      $('.create-group-chat').hide();
    } else {
      $('.create-group-chat').show();
    }
  });
}

function changeScreenChat() {
  $('.room-chat').unbind('click').on('click', function () {
    let chatId = $(this).find('li').data('chat');
    $('.person').removeClass('active');
    $(`.person[data-chat=${chatId}]`).addClass('active');
    $(this).tab('show');

    // Cấu hình thanh cuộn bên box chat mỗi khi click chuột vào 1 cuộc trò truyện cụ thể
    nineScrollRight(chatId);

    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(chatId);

    // Bật chat tin nhắn hình ảnh
    imageChat(chatId);

    // Bật chat tệp
    attachmentChat(chatId);

    // Bật video chat
    videoChat(chatId);
  });
}

$(document).ready(function () {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();

  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Hiển thị thông báo flash trên màn hình master
  flashMasterNotify();

  // Thay đổi kiểu trò chuyện
  changeTypeChat();

  // Thay đổi màn hình chat
  changeScreenChat();

  $('ul.people').find('a')[0].click();
});

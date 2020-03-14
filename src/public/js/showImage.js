function showImage() {
  // let modal = $('#myModal');

  // Get the image and insert it inside the modal - use its "alt" text as a caption
  let imgs = $('.bubble-image');
  // let modalImg = $('#img01');

  imgs.each(function() {
    $(this).on('click', function () {
      $('#myModal').css('display', 'block');
      $('#img01').attr('src', $(this).attr('src'));
    })
  });

  // Get the <span> element that closes the modal
  

  // When the user clicks on <span> (x), close the modal
  $('.close-modal').on('click',function () {
    $('#myModal').css('display', 'none');
  });
}

$(document).ready(function () {
  showImage();
});

$(document).ready(function(){
  $("button.upload").click(function(){
    $(this).blur();
    $(".uploadform > input[type=file]").click().change(function(){
      var file = $(this).get(0).files.file;

      // send file to be uploaded
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: {
          file: file
        }
      });

    });
  });


  $.ajax({
    url: '/upload',
    type: 'POST',
    data: {
      thing: "thang"
    }//,
    //cache: false,
    //contentType: false,
    //processData: false
  });


});
$(document).ready(function(){
  //$("button.upload").click(function(){
  //  $(".uploadform > input[type=file]").click().change(function(){
  //    $(".uploadform > input[type=submit]").click();
  //  });
  //});

  $.ajax({
    url: '/upload',
    type: 'POST',
    data: {
      thing: "thang"
      /*
      payload : formData,
      filename: $('#file_payload').val().split(/(\\|\)/g).pop(),
      cwd : path
      */
    }//,
    //cache: false,
    //contentType: false,
    //processData: false
  });

});
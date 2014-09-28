$(document).ready(function(){

  console.log(username);

  $("button.upload").click(function(){
    $(this).blur();
    $(".uploadform > input[type=file]").click().change(function(){
      var files = $(this).get(0).files;

      // Create a new FormData object.
      var formData = new FormData();

      // Loop through each of the selected files.
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        // Add the file to the request.
        formData.append(i, file, file.name);
      }

      // send file to be uploaded
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false
      });

    });
  });

/*
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
*/

});
$(document).ready(function(){
  $("button.upload").click(function(){
    $(this).blur();
    $(".uploadform > input[type=file]").click().change(function(e){
      uploadFile(e, function(file){
        $("table tbody").prepend('<tr><td>'+file.originalFilename+'</td><td><a href="'+file.webContentLink+'">download</a></td></tr>');
      });
    });
  });

  $("input.search").keypress(function(key){
    if (key.charCode===13) {
      $(this).empty();
      loadClient(function() {
        // TODO logics
        // TRYING TO MAKE REQUESTS
        gapi.client.request({
          'path': '/drive/v2/files',
          'method': 'GET',
          'params': { q: $("input.search").text() }
        }).execute(function(x){
          console.log(x);
          $("table tbody").empty();
          x.items.map(function(file){
            $("table tbody").append('<tr><td>'+file.title+'</td><td><a href="'+file.webContentLink+'">download</a></td></tr>');
          });
        });
      });
    }
  });

/*
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

      //formData.path = [];

      // send file to be uploaded
      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false
      });

    });
  });
*/

});
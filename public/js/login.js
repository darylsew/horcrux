function submit() {
  inputs = "blaze";
  $.ajax ({
    type: "POST",
    url: "user_auth",
    data: inputs,
    success: function() {
      alert('logged in');
    }
  });
}

$(document).ready(function(){
  $("input").keypress(function(e){ if (e.charCode===13) $(".submit").click(); });
});
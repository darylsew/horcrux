$(document).ready(function(){
  $("input").keypress(function(e){ if (e.charCode===13) $("input.submit[name=login]").click(); });
});
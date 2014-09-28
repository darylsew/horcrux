var CLIENT_ID = 'xizwa8fp6bx8l7qh9y6hn9j04p79mhor';
var RESPONSE_TYPE = 'code';
var SECURITY_TOKEN= 'fake_security_token';


$(document).ready(function(){
  var url = 'https://app.box.com/api/oauth2/authorize';
  url += '?response_type=' + RESPONSE_TYPE;
  url += '&client_id=' + CLIENT_ID;
  url += '&state=' + SECURITY_TOKEN;
  console.log(url);
  window.location = url;
});

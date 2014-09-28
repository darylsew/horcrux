var CLIENT_ID = '000000004C128E10';
var RESPONSE_TYPE = 'code';
var SCOPES = 'wl.signin%20wl.basic%20wl.skydrive%20wl.skydrive_update%20';
var REDIRECT_URI = 'http://cafedaydream.com:3000/onedrive';



$(document).ready(function(){
  var url = 'https://login.live.com/oauth20_authorize.srf';
  //client_id=CLIENT_ID&scope=SCOPES&response_type=token&redirect_uri=REDIRECT_URI';
  url += '?client_id=' + CLIENT_ID;
  url += '&response_type=' + RESPONSE_TYPE;
  url += '&scope=' + SCOPES;
  url += '&redirect_uri=' + REDIRECT_URI;
  console.log(url);
  window.location = url;
});

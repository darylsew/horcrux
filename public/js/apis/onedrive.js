var CLIENT_ID = '000000004C128E10';
var RESPONSE_TYPE = 'token';
var SCOPES = 'wl.signin%20wl.skydrive%20wl.skydrive_update%20';
var REDIRECT_URI = 'http://cafedaydream.com/onedrive';



$(document).ready(function(){
  if (window.location.hash.length > 0) {
    var access_token = window.location.hash.split('&')[0];
    access_token = access_token.substring(1, access_token.length);
    console.log("access token onedrive: " + access_token);
    $.ajax({
      url: 'http://cafedaydream.com/onedrive?' + access_token
    });
  } else {
    var url = 'https://login.live.com/oauth20_authorize.srf';
    //client_id=CLIENT_ID&scope=SCOPES&response_type=token&redirect_uri=REDIRECT_URI';
    url += '?client_id=' + CLIENT_ID;
    url += '&response_type=' + RESPONSE_TYPE;
    url += '&scope=' + SCOPES;
    url += '&redirect_uri=' + REDIRECT_URI;
    console.log(url);
    window.location = url;

  }
});

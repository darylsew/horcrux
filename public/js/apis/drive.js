var CLIENT_ID = '962521019900-vp3bq6smivsdlm7id06d5sqqdtju8226.apps.googleusercontent.com';
var SCOPES = 'https://www.googleapis.com/auth/drive';

$(document).ready(function(){
  // LOAD IN THE DRIVE NONSENSE
  var bodyEl = document.body;
  var scriptEl = document.createElement('script');
  scriptEl.type = 'text/javascript';
  scriptEl.src = "https://apis.google.com/js/client.js?onload=handleClientLoad";
  bodyEl.appendChild(scriptEl);
});

/**
 * Called when the client library is loaded to start the auth flow.
 */
function handleClientLoad() {
  window.setTimeout(checkAuth, 1);
}

/**
 * Check if the current user has authorized the application.
 */
function checkAuth() {
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
      handleAuthResult);
}

/**
 * Load the Drive API client.
 * @param {Function} callback Function to call when the client is loaded.
 */
function loadClient(callback) {
  gapi.client.load('drive', 'v2', callback);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // Access token has been successfully retrieved, requests can be sent to the API.

    // GET THE DRIVE STUFF
    loadClient(function() {
      alert("We have your drive, thx.");
      // TODO logics
      // TRYING TO MAKE REQUESTS
      gapi.client.request({
        'path': '/drive/v2/files',
        'method': 'GET'//,
        //'params': {'uploadType': 'multipart'},
        //'headers': { 'Content-Type': 'multipart/mixed; boundary="' + boundary + '"' },
        //'body': multipartRequestBody
      }).execute(function(x){
        console.log(x);
      });
    });

  } else {
    // No access token could be retrieved, show the button to start the authorization flow.
    alert('please connect to drive...');
    gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
      handleAuthResult);
  }
}

/**
 * Start the file upload.
 *
 * @param {Object} evt Arguments from the file selector.
 */
function uploadFile(evt) {
  alert('uploaded');
  gapi.client.load('drive', 'v2', function() {
    var file = evt.target.files[0];
    insertFile(file);
  });
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': fileData.name,
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
  }
}

/**
 * Print a file's metadata.
 *
 * @param {String} fileId ID of the file to print metadata for.
 */
function printFile(fileId) {
  var request = gapi.client.drive.files.get({
      'id': fileId
  });
  request.execute(function(resp) {
    if (!resp.error) {
      console.log('Title: ' + resp.title);
      console.log('Description: ' + resp.description);
      console.log('MIME type: ' + resp.mimeType);
    } else if (resp.error.code == 401) {
      // Access token might have expired.
      checkAuth();
    } else {
      console.log('An error occured: ' + resp.error.message);
    }
  });
}

/**
 * Download a file's content.
 *
 * @param {File} file Drive File instance.
 * @param {Function} callback Function to call when the request is complete.
 */
function downloadFile(file, callback) {
  if (file.downloadUrl) {
    var accessToken = gapi.auth.getToken().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file.downloadUrl);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.onload = function() {
      callback(xhr.responseText);
    };
    xhr.onerror = function() {
      callback(null);
    };
    xhr.send();
  } else {
    callback(null);
  }
}

// FILEPICKER
/* 
  var authButton = document.getElementById('authorizeButton');
  var filePicker = document.getElementById('filePicker');
  authButton.style.display = 'none';
  filePicker.style.display = 'none';
  if (authResult && !authResult.error) {
    // Access token has been successfully retrieved, requests can be sent to the API.
    filePicker.style.display = 'block';
    filePicker.onchange = uploadFile;
  } else {
    // No access token could be retrieved, show the button to start the authorization flow.
    authButton.style.display = 'block';
    authButton.onclick = function() {
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    };
  }
  */

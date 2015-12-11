function hasFileApi() {
  return window.File && window.FileReader && window.FileList && window.Blob;
}

window.webRTCSocket = new WebRTCSocket();

var url = 'wss://d40373764.dvuadmin.net:8443'; //work
//var url           = 'ws://192.168.1.6:8888'; //home

// var onLoginClick = function(event) {
//   webRTCSocket.connect(url, function() {
//     console.log("Ready to create room.");
//   });
//
//   var localVideo = document.querySelector('#localVideo');
//   var remoteVideo = document.querySelector('#remoteVideo');
//   webRTC = new WebRTC(localVideo, remoteVideo, webRTCSocket);
// }

// var onLoginClick = function(event) {
//   webRTCSocket.connect(url, function() {
//     console.log("Ready to create room.");
//
//     var username = document.querySelector('#username').value;
//     var localVideo = document.querySelector('#localVideo');
//     var remoteVideo = document.querySelector('#remoteVideo');
//     webRTC = new WebRTC(localVideo, remoteVideo, webRTCSocket);
//     webRTCSocket.createRoom(username, roomname);
//
//   });

//}
// var onCreateClick = function(event) {
//   var usernameInput = document.querySelector('#username');
//   var roomnameInput = document.querySelector('#roomname');
//
//   var username = usernameInput.value;
//   var roomname = roomnameInput.value;
//
//   if (username.length > 0 && roomname.length > 0) {
//     webRTCSocket.createRoom(username, roomname);
//   }
// }

function showRooms(response) {
  console.log(response);
  if (response.value.length === 0) {
    alert("No no in onlone.");
    return;
  }
  var ul = document.querySelector('#roomlist');
  var ids = response.value;
  for (index in ids) {
    var li = document.createElement('li');
    var button = document.createElement('button');
    var text = document.createTextNode(ids[index]);
    var att = document.createAttribute("onclick");       // Create a "class" attribute
    att.value = "window.onJoinClick('" + ids[index] + "')";                           // Set the value of the class attribute
    button.setAttributeNode(att);
    button.appendChild(text);
    li.appendChild(button);
    ul.appendChild(li);
  }
}

window.onJoinClick = function(callerID) {
  var username = document.querySelector('#username').value;
  webRTCSocket.joinRoom(username, callerID);
}

var onCallClick = function(event) {
  webRTC.startPeerConnection();
}

var onHangupClick = function(event) {
  webRTCSocket.send({
    type: "leave"
  });

  onLeave();
}

// var onSendMessageClick = function(event) {
//   var received = document.querySelector('#received');
//   var messageInput = document.querySelector('#message');
//   var val = messageInput.value;
//   var message = {type:'message', data:val};
//   received.innerHTML += "send: " + val + "<br/>";
//   received.scrollTop = received.scrollHeight;
//   webRTC.sendDataChannel.send(JSON.stringify(message));
// }

var onSendFileClick = function(event) {
  var files = document.querySelector('#files').files;
  if (files.length > 0) {
    var file = files[0];
    webRTC.sendDataChannel.send(JSON.stringify({
      type: 'file',
      data: {name: file.name, size: file.size}
    }));
    sendFile(file);
  }
}

// Implements WebRTCSocket callbacks
function onLogin(response) {

  if (response.success === false) {
    alert("Login unsuccessful, please try a different name.");
  } else {
    webRTC.roomname = response.roomname;
    webRTC.startConnection();
  }
}

function onJoin(response) {

  if (response.success === false) {
    alert("Join unsuccessful, please try a different name.");
  } else {
    console.log("Join successful.");
    window.webRTC.startConnection();
  }
}

function onLeave() {
  remoteVideo.src = null;
  webRTC.closePeerConnection();
}

function onError(response) {
  alert(response.message);
}


// function sendFile(file) {
//   var reader = new FileReader();
//   reader.onerror = function(e) {
//     console.log("onerror");
//   };
//   reader.onprogress = updateProgress;
//
//   reader.onabort = function(e) {
//     alert('File read cancelled');
//   };
//   reader.onloadstart = function(e) {
//     console.log("onloadstar");
//     //document.getElementById('progress_bar').className = 'loading';
//   };
//   reader.onload = function(e) {
//     console.log("onload is done?");
//
//     // Ensure that the progress bar displays 100% at the end.
//     // progress.style.width = '100%';
//     // progress.textContent = '100%';
//     // setTimeout("document.getElementById('progress_bar').className='';", 2000);
//   }
//   reader.readAsArrayBuffer(file);
// }

function updateProgress(evt) {
  // evt is an ProgressEvent.
  if (evt.lengthComputable) {
    webRTC.sendDataChannel.send(evt.target.result);
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    // if (percentLoaded < 100) {
    //   progress.style.width = percentLoaded + '%';
    //   progress.textContent = percentLoaded + '%';
    // }
    console.log("onprogress: " + percentLoaded + '%');
  }
}

//To do
function sendFile(file) {
  console.log('file is ' + [file.name, file.size, file.type, file.lastModifiedDate].join(' '));

  // Handle 0 size files.
  //statusMessage.textContent = '';
  //downloadAnchor.textContent = '';
  if (file.size === 0) {
    console.log("Content is empty");
    return;
  }
  //sendProgress.max = file.size;
  //receiveProgress.max = file.size;
  var chunkSize = 16384;
  var sliceFile = function(offset) {
    var reader = new window.FileReader();

    reader.onload = (function() {
      return function(e) {
        webRTC.sendDataChannel.send(e.target.result);
        if (file.size > offset + e.target.result.byteLength) {
          window.setTimeout(sliceFile, 0, offset + chunkSize);
        }
        //sendProgress.value = offset + e.target.result.byteLength;
      };
    })(file);

    var slice = file.slice(offset, offset + chunkSize);
    reader.readAsArrayBuffer(slice);
  };

  sliceFile(0);
}

// To do
window.fileInfo = {};
var receiveBuffer = [];
var receivedSize = 0;
var downloadAnchor = document.querySelector('a#download');

function onReceiveFileCallback(data) {
  // trace('Received Message ' + event.data.byteLength);
  receiveBuffer.push(data);
  receivedSize += data.byteLength;

  //receiveProgress.value = receivedSize;

  // we are assuming that our signaling protocol told
  // about the expected file size (and name, hash, etc).
  if (receivedSize === fileInfo.size) {
    var received = new window.Blob(receiveBuffer);
    receiveBuffer = [];

    var downloadAnchor = document.querySelector('a#download');
    downloadAnchor.href = URL.createObjectURL(received);
    downloadAnchor.download = fileInfo.name;
    downloadAnchor.textContent =
      'Click to download \'' + fileInfo.name + '\' (' + fileInfo.size + ' bytes)';
    downloadAnchor.style.display = 'block';

    receivedSize = 0;
    window.fileInfo = {};
  }
}

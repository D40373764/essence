function hasFileApi() {
  return window.File && window.FileReader && window.FileList && window.Blob;
}

window.webRTCSocket = new WebRTCSocket();

//var url = 'wss://d40373764.dvuadmin.net:8443'; //work
var url = 'wss://192.168.1.6:8443'; //home

function showRooms(response) {
  console.log(response);
  if (response.value.length === 0) {
    alert("No no in onlone.");
    return;
  }
  var roomListDiv = document.querySelector('#roomlist');
  if (roomListDiv.firstChild !== null) {
    roomListDiv.firstChild.remove();
  }

  var ul = document.createElement('ul');

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

  roomListDiv.appendChild(ul);
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
  location.reload();
  // remoteVideo.src = null;
  // webRTC.closePeerConnection();
}

function onError(response) {
  alert(response.message);
}


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
  var sendProgress = document.querySelector('progress#sendProgress');
  console.log('file is ' + [file.name, file.size, file.type, file.lastModifiedDate].join(' '));

  // Handle 0 size files.
  //statusMessage.textContent = '';
  //downloadAnchor.textContent = '';
  if (file.size === 0) {
    console.log("Content is empty");
    return;
  }

  sendProgress.max = file.size;
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
        sendProgress.value = offset + e.target.result.byteLength;
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
var sendProgress = undefined;

function onReceiveFileCallback(data) {
  if (sendProgress === undefined) {
    sendProgress = document.querySelector('progress#sendProgress');
    sendProgress.max = fileInfo.size;
  }

  // trace('Received Message ' + event.data.byteLength);
  receiveBuffer.push(data);
  receivedSize += data.byteLength;

  sendProgress.value = receivedSize;

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

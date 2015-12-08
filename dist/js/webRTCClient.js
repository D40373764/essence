
var webRTCSocket  = new WebRTCSocket();
var webRTC;

var url           = 'wss://d40373764.dvuadmin.net:8443'; //work
//var url           = 'ws://192.168.1.6:8888'; //home

var onLoginClick = function(event) {
  webRTCSocket.connect(url, function() {
    console.log("Ready to create room.");
  });

  var localVideo  = document.querySelector('#localVideo');
  var remoteVideo = document.querySelector('#remoteVideo');
  webRTC = new WebRTC(localVideo, remoteVideo, webRTCSocket);
}

var onCreateClick = function(event) {
  var usernameInput = document.querySelector('#username');
  var roomnameInput = document.querySelector('#roomname');

  var username = usernameInput.value;
  var roomname = roomnameInput.value;

  if (username.length > 0 && roomname.length > 0) {
    webRTCSocket.createRoom(username, roomname);
  }
}

var onJoinClick = function(event) {
  var usernameInput = document.querySelector('#username');
  var roomnameInput = document.querySelector('#roomname');

  var username = usernameInput.value;
  var roomname = roomnameInput.value;

  if (username.length > 0 && roomname.length > 0) {
    webRTCSocket.joinRoom(username, roomname);
  }
}

var onCallClick = function(event) {
  webRTC.startPeerConnection();
}

// var onDataChannelClick = function(event) {
//   var received = document.querySelector('#received');
//   webRTC.createDataChannel(received);
// }

var onHangupClick = function(event) {
  webRTCSocket.send({
    type: "leave"
  });

  onLeave();
}

var onSendClick = function(event) {
  var received = document.querySelector('#received');
  var messageInput = document.querySelector('#message');
  var val = messageInput.value;
  received.innerHTML += "send: " + val + "<br/>";
  received.scrollTop = received.scrollHeight;
  webRTC.sendDataChannel.send(val);
}

// Implements WebRTCSocket callbacks
function onLogin(response) {

  if (response.success === false) {
    alert("Login unsuccessful, please try a different name.");
  } else {
    webRTC.startConnection();
  }
}

function onJoin(response) {

  if (response.success === false) {
    alert("Join unsuccessful, please try a different name.");
  } else {
    console.log("Join successful.");
    webRTC.startConnection();
  }
}

function onLeave() {
  remoteVideo.src = null;
  webRTC.closePeerConnection();
}

function onError(response) {
  alert(response.message);
}

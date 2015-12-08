navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;
window.RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;

function hasUserMedia() {
  return !!(navigator.getUserMedia);
}

function hasRTCPeerConnection() {
  return !!(window.RTCPeerConnection);
}

function WebRTC(localVideo, remoteVideo, socket) {
  this.localVideo     = localVideo; // document.querySelector('#localVideo');
  this.remoteVideo    = remoteVideo; //document.querySelector('#remoteVideo');
  this.username       = undefined;
  this.roomname       = undefined;
  this.stream         = undefined;
  this.peerConnection = undefined;
  this.iceServers     = [{ "url": "stun:127.0.0.1:9876" }];
  this.constraints    = { audio: true, video: true };
  this.socket         = socket;
  var parent          = this;

  this.startConnection = function() {

    if (hasUserMedia() && hasRTCPeerConnection()) {
      navigator.getUserMedia(parent.constraints, parent.successCallback, parent.errorCallback);
    } else {
      alert("Your browser does not support WebRTC.")
    }
  }

  this.successCallback = function(stream) {
    parent.stream = stream;
    parent.localVideo.src = window.URL.createObjectURL(stream);
    parent.setupPeerConnection(stream);
  }

  this.errorCallback = function(error) {
    console.log("getUserMedia error: ", error);
  }

  this.startPeerConnection = function() {

      parent.peerConnection.createOffer(function(offer) {
        socket.send({
          type: "offer",
          offer: offer
        });
        parent.peerConnection.setLocalDescription(offer);
      }, function(error) {
        alert("Failed to create offer.");
      });
  }

  this.setupPeerConnection = function(stream) {
    var configuration = {
      "iceServers": parent.iceServers
    };

    parent.peerConnection = new RTCPeerConnection(configuration);
    parent.peerConnection.addStream(stream);

    parent.peerConnection.onaddstream = function(e) {
      parent.remoteVideo.src = window.URL.createObjectURL(e.stream);
    }

    // Setup ice handling
    parent.peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        parent.socket.send({
          type: "candidate",
          candidate: event.candidate
        });
      }
    }
  }

  this.closePeerConnection = function() {
    parent.peerConnection.close();
    parent.peerConnection.onicecandidate = null;
    parent.peerConnection.onaddstream = null;
    parent.setupPeerConnection(parent.stream);
  }
};

function onOffer(response) {
  var peerConnection = webRTC.peerConnection;

  peerConnection.setRemoteDescription(new RTCSessionDescription(response.offer));

  peerConnection.createAnswer(function(answer) {
    peerConnection.setLocalDescription(answer);
    webRTCSocket.send({
      type: "answer",
      answer: answer
    });
  }, function(error) {
    alert("Failed to create answer:" + error);
  });
}

function onAnswer(response) {
  webRTC.peerConnection.setRemoteDescription(new RTCSessionDescription(response.answer));
}

function onCandidate(response) {
  webRTC.peerConnection.addIceCandidate(new RTCIceCandidate(response.candidate));
}

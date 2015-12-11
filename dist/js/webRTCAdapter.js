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
  this.sendDataChannel    = undefined;
  this.receiveDataChannel = undefined;
  this.iceServers     = [{ "url": "stun:127.0.0.1:9876" }];
  this.constraints    = { audio: true, video: true };
  this.socket         = socket;
  var parent          = this;

  this.createDataChannel = function(received) {
    var dataChannelOptions = [{
      RtpDataChannels: true
    }];

    var sendDataChannel = parent.peerConnection.createDataChannel("sendDataChannel", dataChannelOptions);

    sendDataChannel.onerror = function(error) {
      console.log("Data Channel Error: " + error);
    }

    sendDataChannel.onmessage = function(event) {
      console.log("Data Channel message: " + event.data);
      received.innerHTML += "recv: " + event.data + "<br/>";
      received.scrollTop = received.scrollHeight;
    }

    sendDataChannel.onopen  = onSendDataChannelStateChange
    sendDataChannel.onclose = onSendDataChannelStateChange;

    parent.sendDataChannel = sendDataChannel;

    console.log("Send Data Channel is ready");
  }

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

    var peerConnection = new RTCPeerConnection(configuration);
    peerConnection.addStream(stream);

    peerConnection.onaddstream = function(e) {
      parent.remoteVideo.src = window.URL.createObjectURL(e.stream);
    }

    // Setup ice handling
    peerConnection.onicecandidate = function(event) {
      if (event.candidate) {
        parent.socket.send({
          type: "candidate",
          candidate: event.candidate
        });
      }
    }

    peerConnection.ondatachannel = function(event) {
      console.log('Receive Channel Callback');
      var receiveDataChannel = event.channel;
      receiveDataChannel.onmessage = onReceiveMessageCallback;
      receiveDataChannel.onopen = onReceiveDataChannelStateChange;
      receiveDataChannel.onclose = onReceiveDataChannelStateChange;
      parent.receiveDataChannel = receiveDataChannel;
    }

    parent.peerConnection = peerConnection;

    var received = document.querySelector('#received');
    parent.createDataChannel(received);

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

function onReceiveMessageCallback(event) {
  if (Object.keys(window.fileInfo).length === 0) {
    console.log("Received message: " + event.data);
    var message = JSON.parse(event.data);
    switch (message.type) {
      case 'message':
        var received = document.querySelector('#received');
        received.innerHTML += "recv: " + message.data + "<br/>";
        received.scrollTop = received.scrollHeight;
        break;
      case 'file':
        window.fileInfo = message.data;
        break;
      default:
    }
  }
  else {
    onReceiveFileCallback(event.data);
  }
}

function onReceiveDataChannelStateChange() {
  var readyState = webRTC.receiveDataChannel.readyState;
  console.log('Data channel state is: ' + readyState);
}

function onSendDataChannelStateChange() {
  var readyState = webRTC.sendDataChannel.readyState;
  console.log('Data channel state is: ' + readyState);
}

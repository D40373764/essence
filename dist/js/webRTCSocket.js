function WebRTCSocket() {
  this.username = undefined;
  this.roomname = undefined;
  this.socket   = undefined;
  var parent    = this;

  this.connect = function(url, callback) {
    //WebRTCSocket.socket = new WebSocket('ws://10.254.187.52:8888'); // work
    //'ws://192.168.1.6:8888';
    var socket = new WebSocket(url);

    socket.onopen = function() {
      console.log("Signaling Server Connected.");
      callback();
    };

    socket.onmessage = function(message) {
      console.log("Got message: ", message.data);

      var data = JSON.parse(message.data);

      switch(data.type) {
        case 'login':
          parent.username = data.username;
          parent.roomname = data.roomname;
          onLogin(data);
          break;
        case 'join':
          onJoin(data);
          break;
        case 'offer':
          onOffer(data);
          break;
        case 'answer':
          onAnswer(data);
          break;
        case 'candidate':
          onCandidate(data);
          break;
        case 'leave':
          onLeave();
          break;
        case 'error':
          onError(data);
          break;
        case 'rooms':
          showRooms(data);
          break;
        default:
          onDefault(data);
      }
    };

    socket.onerror = function(error) {
      console.log("Got error", error);
    };

    parent.socket = socket;
  };

  this.createRoom = function(username) {
    parent.send({
      type: "login",
      username: username,
    });

    parent.username = username;
  };

  this.joinRoom = function(username, roomname) {
    parent.send({
      type: "join",
      username: username,
      roomname: roomname
    });

    parent.username = username;
    parent.roomname = roomname;
  };

  this.send = function(message) {
    if (parent.username != undefined) {
      message.username = parent.username;
    }
    if (parent.roomname != undefined) {
      message.roomname = parent.roomname;
    }
    parent.socket.send(JSON.stringify(message));
  };

};

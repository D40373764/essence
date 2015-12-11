'use strict';

var body = document.body, // default React render path is html body
    byID = document.getElementById("header"),
    header = document.querySelector(".header"),
    content = document.querySelector(".content"),
    footer = document.querySelector(".footer"),
    React = Essence.React,
    ReactDOM = Essence.ReactDOM,
    AppBar = Essence.AppBar,
    BottomSheets = Essence.BottomSheets,
    BottomSheetsItem = Essence.BottomSheetsItem,
    Btn = Essence.Btn,
    BtnItem = Essence.BtnItem,
    Block = Essence.Block,
    Card = Essence.Card,
    CardItem = Essence.CardItem,
    CardItemHeader = Essence.CardItemHeader,
    CardItemContent = Essence.CardItemContent,
    CardItemFooter = Essence.CardItemFooter,
    Chip = Essence.Chip,
    ChipItem = Essence.ChipItem,
    DatePicker = Essence.DatePicker,
    DatePickerItem = Essence.DatePickerItem,
    DatePickerHeader = Essence.DatePickerHeader,
    DatePickerHeaderDay = Essence.DatePickerHeaderDay,
    DatePickerHeaderDate = Essence.DatePickerHeaderDate,
    DatePickerContent = Essence.DatePickerContent,
    DatePickerFooter = Essence.DatePickerFooter,
    Dialog = Essence.Dialog,
    DialogItem = Essence.DialogItem,
    DialogItemHeader = Essence.DialogItemHeader,
    DialogItemContent = Essence.DialogItemContent,
    DialogItemFooter = Essence.DialogItemFooter,
    Divider = Essence.Divider,
    Icon = Essence.Icon,
    Image = Essence.Image,
    Input = Essence.Input,
    InputItem = Essence.InputItem,
    List = Essence.List,
    ListItem = Essence.ListItem,
    Menu = Essence.Menu,
    MenuItem = Essence.MenuItem,
    Navigation = Essence.Navigation,
    Paper = Essence.Paper,
    PaperItem = Essence.PaperItem,
    Progress = Essence.Progress,
    Slider = Essence.Slider,
    SliderItem = Essence.SliderItem,
    Snackbar = Essence.Snackbar,
    SnackbarItem = Essence.SnackbarItem,
    Switch = Essence.Switch,
    SwitchItem = Essence.SwitchItem,
    TabItem = Essence.TabItem,
    TabMenu = Essence.TabMenu,
    Text = Essence.Text,
    Toast = Essence.Toast,
    ToastItem = Essence.ToastItem,
    ToolBar = Essence.ToolBar,
    BackgroundColor = Essence.BackgroundColor,
    ClassNames = Essence.ClassNames,
    ClickPosition = Essence.ClickPosition,
    DateFormat = Essence.DateFormat,
    Mobile = Essence.Mobile,
    Position = Essence.Position,
    PositionHorizontal = Essence.PositionHorizontal,
    PubSub = Essence.PubSub;

var LoginBox = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  onLoginClick: function(event) {
    webRTCSocket.connect(url, function() {
      console.log("Server connected.");
      var username = document.querySelector('#username').value;
      if (username.length === 0) {
        alert('Please enter your name.');
        return false;
      }
      var localVideo = document.querySelector('#localVideo');
      var remoteVideo = document.querySelector('#remoteVideo');
      window.webRTC = new window.WebRTC(localVideo, remoteVideo, webRTCSocket);
      webRTCSocket.createRoom(username);
    });
  },
  getRooms: function() {
    var username = document.querySelector('#username').value;
    if (username.length === 0) {
      alert('Please enter your name.');
      return false;
    }
    if (webRTCSocket.socket === undefined) {
      webRTCSocket.connect(url, function() {
        window.webRTC = new window.WebRTC(localVideo, remoteVideo, webRTCSocket);
        webRTCSocket.send({type:'rooms'});
      });
    } else {
      webRTCSocket.send({type:'rooms'});
    }
  },
  render: function() {
    return (
      <div className="box">
        <span className="">
          <input type="text" id="username" placeholder="Enter your name here"></input>
          <BtnItem
            icon='av-videocam'
            type='fab'
            mini={true}
            classes={'e-background-blue-A200'}
            onClick={this.onLoginClick}
            tooltipText='Login'
            />
          <BtnItem
            id="callerIdButton"
            icon='av-recent-actors'
            type='fab'
            mini={true}
            classes={'e-background-blue-A200'}
            onClick={this.getRooms}
            tooltipText='Show online users'
            />

          <ul id="roomlist">
          </ul>
        </span>
      </div>
    );
  }
});

var MessageBox = React.createClass({
  onSendMessageClick: function(event) {
    var received = document.querySelector('#received');
    var messageInput = document.querySelector('#message');
    var val = messageInput.value;
    var message = {type:'message', data:val};
    received.innerHTML += "send: " + val + "<br/>";
    received.scrollTop = received.scrollHeight;
    webRTC.sendDataChannel.send(JSON.stringify(message));
  },
  render: function() {
    return (
      <div className="box">
        <span className="">
          <input type="text" id="message" placeholder="Message"></input>
          <BtnItem
            id="sendButton"
            icon='communication-quick-contacts-mail'
            type='fab'
            mini={true}
            classes={'e-background-blue-A200'}
            onClick={this.onSendMessageClick}/>
        </span>
        <div id='received' />
      </div>
    );
  }
});

var FileBox = React.createClass({
  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
  },
  onSendFileClick: function(event) {
    var files = document.querySelector('#files').files;
    if (files.length > 0) {
      var file = files[0];
      webRTC.sendDataChannel.send(JSON.stringify({
        type: 'file',
        data: {name: file.name, size: file.size}
      }));
      sendFile(file);
    }
  },
  render: function() {
    return (
      <div className="box">
        <Block type='li'>
          <input type="file" id="files" name="file" />
        </Block>
        <Block type='li'>
          <BtnItem
            classes={'raised e-background-blue-A200'}
            onClick={this.onSendFileClick}
            label='Send File'/>
        </Block>
        <Block type='li'>
          <a id="download"></a>
        </Block>
      </div>
    );
  }
});

var Main = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    return (
      <div>
        <LoginBox />
        <MessageBox />
      </div>
    );
  }
});

var VideoCard = React.createClass({
  startTalk: function(event) {
    console.log("startTalk");
    window.webRTC.startPeerConnection();
  },
  render: function() {
    return (
      <Card>
        <CardItem>
          <CardItemContent classes={"card-supporting-text e-text-blue-grey-400"}>
            <video id={this.props.id} autoPlay controls></video>
          </CardItemContent>

          <CardItemFooter>
            <Block type="div" classes={"e-left"}>
              <BtnItem
                onClick={this.startTalk}
                icon='communication-quick-contacts-dialer'
                classes={'e-text-indigo-400'}
                label='Yes'
                type='fab'
                mini={true}
                rippleEffect={true}
              />
            </Block>
            <Block type="div" classes={"e-left"}>
              <BtnItem
                icon='communication-call-end'
                classes={''}
                label='No'
                type='fab'
                mini={true}
                rippleEffect={true}
              />
            </Block>
          </CardItemFooter>
        </CardItem>
      </Card>
    );
  }
});

ReactDOM.render(
  <Block type='div' classes='e-background-red-500 e-text-center'>
    <a href='https://d40373764.dvuadmin.net:8443'>Accept untrusted connection to Signaling Server</a>
  </Block>
  ,byID
);

ReactDOM.render(
    <Main />
    ,header
);

ReactDOM.render(
    <Block type='div'>
      <Block classes={"e-row"}>
        <Block classes={"brick brick-9"}>
          <VideoCard id="remoteVideo" width="240px"/>
        </Block>
        <Block classes={"brick brick-3"}>
          <VideoCard id="localVideo" width="200px"/>
        </Block>

      </Block>
    </Block>
    ,content
);

ReactDOM.render(
    <Block type='div' classes='e-background-blue-500 e-text-center'>
      <FileBox />
    </Block>
    ,footer
);

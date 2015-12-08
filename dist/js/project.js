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

ReactDOM.render(
    <Block type='div' classes='e-background-grey-500 e-text-center'>
        your content by ID # here
    </Block>
    ,byID
);

ReactDOM.render(
    <Block type='div' classes='e-background-red-500 e-text-center'>
      your content by class .header here
    </Block>
    ,header
);

ReactDOM.render(
    <Block type='div'>
      <Block classes={"e-row"}>
        <Block type='div' classes={'brick brick-2 e-text-left e-padding-top-15'}>

          <List type={'single-line'}>
            <ListItem>
              <Block type='li'>
                <BtnItem
                  classes={'raised e-background-blue-A200'}
                  onClick={onLoginClick}
                  label='Login'/>
              </Block>
            </ListItem>
            <ListItem>
              <Block type='li'>
                <BtnItem
                  classes={'raised e-background-blue-A200'}
                  onClick={onCreateClick}
                  label='Create Room'/>
              </Block>
            </ListItem>
            <ListItem>
              <Block type='li'>
                <BtnItem
                  classes={'raised e-background-blue-A200'}
                  onClick={onJoinClick}
                  label='Join Room'/>
              </Block>
            </ListItem>
            <ListItem>
              <Block type='li'>
                <BtnItem
                  classes={'raised e-background-blue-A200'}
                  onClick={onCallClick}
                  label='Call'/>
              </Block>
            </ListItem>
            <ListItem>
              <Block type='li'>
                <BtnItem
                  classes={'raised e-background-blue-A200'}
                  onClick={onHangupClick}
                  label='Hang Up'/>
              </Block>
            </ListItem>
            <ListItem>
              <Block type='li'>
                <Input>
                <InputItem
                  id="username"
                  classes={'e-input-group has-success'}
                  inputClasses={'e-input empty'}
                  type='text'
                  name='label'
                  placeholder='User Name'
                >
                </InputItem>
                <InputItem
                  id="roomname"
                  classes={'e-input-group has-success'}
                  inputClasses={'e-input empty'}
                  type='text'
                  name='label'
                  placeholder='Room Name'
                >
                </InputItem>
                <InputItem
                  id="message"
                  classes={'e-input-group has-success'}
                  inputClasses={'e-input empty'}
                  type='text'
                  name='label'
                  placeholder='Message'
                >
                </InputItem>
                </Input>
                <BtnItem
                  id="sendButton"
                  classes={'raised e-background-blue-A200'}
                  onClick={onSendClick}
                  label='Send Message'/>
              </Block>
            </ListItem>
          </List>
        </Block>

        <Block classes={"brick brick-6"}>
          <Card>
            <CardItem>
              <CardItemHeader blur={true}>
                <Block type="div" classes={"card-main-image"}>
                  <video id="remoteVideo" autoPlay controls></video>
                </Block>
              </CardItemHeader>

              <CardItemContent classes={"card-supporting-text e-text-blue-grey-400"}>
                <Text type="h4">
                  Remove User
                </Text>
              </CardItemContent>

              <CardItemFooter>
                <Block type="div" classes={"e-left"}>
                  <BtnItem
                    classes={'flat e-text-indigo-400'}
                    label='Yes'
                    type='danger'
                    rippleEffect={true}
                  />
                </Block>
                <Block type="div" classes={"e-left"}>
                  <BtnItem
                    classes={'flat'}
                    label='No'
                    type='default'
                    rippleEffect={true}
                  />
                </Block>
              </CardItemFooter>
            </CardItem>
          </Card>
        </Block>
        <Block classes={"brick brick-1"}>
        to do
        </Block>
        <Block classes={"brick brick-3"}>
          <Card>
            <CardItem>
              <CardItemHeader blur={true}>
                <Block type="div" classes={"card-main-image"}>
                  <video id="localVideo" autoPlay controls muted="muted" width="240"></video>
                </Block>
              </CardItemHeader>

              <CardItemContent classes={"card-supporting-text e-text-blue-grey-400"}>
                <Text type="h4">
                  Local User
                </Text>
              </CardItemContent>

              <CardItemFooter>
                <Block type="div" classes={"e-left"}>
                  <BtnItem
                    classes={'flat e-text-indigo-400'}
                    label='Yes'
                    type='danger'
                    rippleEffect={true}
                  />
                </Block>
                <Block type="div" classes={"e-left"}>
                  <BtnItem
                    classes={'flat'}
                    label='No'
                    type='default'
                    rippleEffect={true}
                  />
                </Block>
              </CardItemFooter>
            </CardItem>
          </Card>
          <div id='received'>
          </div>
        </Block>

      </Block>
    </Block>
    ,content
);

ReactDOM.render(
    <Block type='div' classes='e-background-blue-500 e-text-center'>
      your content by class .footer here
      <Btn>
        <BtnItem
          type='primary'
          classes={'raised'}
          label='Show bottom sheets'
          rippleEffect={true}
          actionClick='bottomsheets'
          actionType={{
            'action': 'show',
            'targetID': 'bottomsheet-simple'
          }}
        />
      </Btn>

      <BottomSheets>
        <BottomSheetsItem id={'bottomsheet-simple'}>
          <List icon={true}>
            <ListItem
              contentLink='#share'
              contentText='Share'
              icon='social-share'
            />
            <ListItem
              contentLink='#upload'
              contentText='Upload'
              icon='file-cloud-upload'
            />
            <ListItem
              contentLink='#copy'
              contentText='Copy'
              icon='content-content-copy'
            />
            <ListItem
              contentLink='#print'
              contentText='Print'
              icon='action-print'
            />
          </List>
        </BottomSheetsItem>
      </BottomSheets>
    </Block>
    ,footer
);

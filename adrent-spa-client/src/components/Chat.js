import React, { Component } from "react";
import { connect } from "react-redux";

import { SlideToggle } from "react-slide-toggle";
import * as ReactDOM from "react-dom";

let active = sessionStorage.getItem("active");

class Chat extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
    this.state = {
      messages: [],
      nextMessage: {},
      newMessage: {},
      messageText: "",
      logMessage: "",
      disabled: false,
      reconnectFailed: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    socket.on("connect", () => {
      console.log("Connected");
      this.setState({
        disabled: this.state.disabled ? false : this.state.disabled,
        reconnectFailed: this.state.reconnectFailed
          ? false
          : this.state.reconnectFailed
      });
    });

    // this.setState({ socket });

    if (this.props.authenticated && this.props.roomId) {
      socket.emit("add user", {
        roomId: this.props.roomId
      });
    }

    socket.on("more chat history", function(data) {
      this.setState({
        messages: [...this.state.messages, ...data.history]
      });
    });

    socket.on("chat history", function(data) {
      this.setState({
        messages: [...this.state.messages, ...data.history]
      });
    });

    socket.on("log message", function(text) {
      this.setState({ logMessage: text });
    });

    socket.on("chat message", function(data) {
      this.setState({ nextMessage: { ...data } });
    });

    socket.on("disconnect", function() {
      this.setState({
        disabled: !this.state.disabled ? true : this.state.disabled,
        reconnectFailed: false
      });
    });

    socket.on("reconnect", function() {
      setTimeout(function() {
        console.log("Reconnected!");
        this.setState({
          disabled: this.state.disabled ? false : this.state.disabled,
          reconnectFailed: false
        });
        if (this.props.authenticated && this.props.roomId)
          socket.emit("add user", {
            roomId: this.props.roomId
          });
      }, 4000);
    });

    socket.on("reconnect_failed", function() {
      this.setState({ reconnectFailed: true });
    });
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let historyHasChanged =
      this.state.messages.length !== prevState.messages.length;
    if (historyHasChanged) {
      const messageList = this.messagesRef.current;
      const scrollBottom = messageList.scrollHeight - messageList.clientHeight;
      return scrollBottom <= 0 || scrollBottom === messageList.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.scrollToBottom();
    }
  }

  _onScroll = () => {
    if (this.messagesRef.current.scrollTop === 0) {
      socket.emit("more messages", {});
    }
  };

  scrollToBottom = () => {
    const maxScrollTop =
      this.messagesRef.current.scrollHeight -
      this.messagesRef.current.clientHeight;
    ReactDOM.findDOMNode(this.messagesRef.current).scrollTop =
      maxScrollTop > 0 ? maxScrollTop : 0;
  };

  messageSubmit(e) {
    if (e.keyCode === 13) {
      let el = document.createElement("div");
      el.textContent = this.state.messageText;
      let cleanedMessage = el.textContent;
      if (cleanedMessage) {
        this.setState({ messageText: "" });
        let time = "" + new Date();
        this.setState({ newMessage: { msg: cleanedMessage, timestamp: time } });
        socket.emit("chat message", {
          roomId: "null",
          msg: cleanedMessage,
          timestamp: time
        });
      }
    }
  }

  handleChange(e) {
    this.setState({ newMessage: e.target.value });
  }

  render() {
    const { roomId } = this.props;
    const {
      logMessage,
      nextMessage,
      disabled,
      newMessage,
      reconnectFailed,
      messageText
    } = this.state;
    let inputBoxPlaceholder = "";
    if (disabled) {
      inputBoxPlaceholder = "Connection Lost! Reconnecting..";
    } else if (reconnectFailed) {
      inputBoxPlaceholder = "No active connection. Please refresh page.";
    } else {
      inputBoxPlaceholder = "Type here...";
    }
    let time = "" + new Date();

    return (
      <SlideToggle
        duration={500}
        collapsed
        render={({ onToggle, setCollapsibleElement }) => (
          <div className="msg_box" style={{ left: 0 }}>
            <div
              onClick={() => {
                onToggle();
                if (roomId && !active) {
                  socket.emit("add user", {
                    roomId: roomId
                  });
                  sessionStorage.setItem("active", true);
                  active = true;
                }
              }}
              className="msg_head"
            >
              Live Chat
            </div>
            <div className="contentArea" ref={setCollapsibleElement}>
              <div className="chatArea">
                <div
                  ref={this.messagesRef}
                  onScroll={this._onScroll}
                  className="messages"
                >
                  <div className="msg_push_old" />
                  {this.state.messages.map(message => {
                    let sender;
                    if (message.isAdmin) sender = "msg_a";
                    else sender = "msg_b";
                    return (
                      <div className={`${sender}`}>
                        {message.msg}
                        <span className="timestamp">
                          {message.timestamp.toLocaleString().substr(15, 6)}
                        </span>
                      </div>
                    );
                  })}
                  {logMessage ? (
                    <div className="msg_a">
                      {logMessage}
                      <span className="timestamp">
                        {time.toLocaleString().substr(15, 6)}
                      </span>
                    </div>
                  ) : null}
                  {Object.keys(nextMessage).length > 0 ? (
                    <div className={nextMessage.isAdmin ? "msg_a" : "msg_b"}>
                      {nextMessage.msg}
                      <span className="timestamp">
                        {nextMessage.timestamp.toLocaleString().substr(15, 6)}
                      </span>
                    </div>
                  ) : null}
                  {/* {Object.keys(newMessage).length > 0 ? (
                    <div className="msg_b">
                      {newMessage.msg}
                      <span className="timestamp">
                        {newMessage.timestamp.toLocaleString().substr(15, 6)}
                      </span>
                    </div>
                  ) : null} */}
                  <div className="msg_push_new" />
                </div>
                <div className="typing" />
                <input
                  disabled={disabled}
                  className="inputMessage"
                  value={messageText}
                  onChange={this.handleChange}
                  rows="1"
                  onKeyPress={this.messageSubmit}
                  placeholder={inputBoxPlaceholder}
                />
              </div>
            </div>
          </div>
        )}
      />
    );
  }
}

export default connect(null)(Chat);

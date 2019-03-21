import React, { Component } from "react";
import { connect } from "react-redux";

import { SlideToggle } from "react-slide-toggle";
import * as ReactDOM from "react-dom";
import "./Chat.css";
import io from "socket.io-client";
const socketUrl = "http://localhost:5000";
const socket = io(socketUrl);

let active = sessionStorage.getItem("active");

class Chat extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
    this.inputMessageRef = React.createRef();
    this.state = {
      messages: [],
      messageText: "",
      disabled: false,
      reconnectFailed: false,
      isTyping: false,
      adminName: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.messageSubmit = this.messageSubmit.bind(this);
    this.timeoutFunction = this.timeoutFunction.bind(this);
    this.typing = false;
    this.timeout = undefined;
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

    if (this.props.authenticated && this.props.roomId) {
      socket.emit("add user", {
        roomId: this.props.roomId
      });
    }

    socket.on("more chat history", data => {
      this.setState({
        messages: [...data.history]
      });
    });

    socket.on("chat history", data => {
      console.log(data);
      if (data && data.history) {
        this.setState({
          messages: [...data.history, ...this.state.messages]
        });
      }
    });

    socket.on("log message", text => {
      const logMessage = {
        isAdmin: true,
        msg: text,
        timestamp: "" + new Date()
      };
      this.setState({ messages: [logMessage, ...this.state.messages] });
    });

    socket.on("chat message", data => {
      //this.setState({ nextMessage: { ...data } });
      this.setState({ messages: [...this.state.messages, data] });
    });

    socket.on("typing", data => {
      if (data.isTyping && data.person != "Client")
        this.setState({ isTyping: true, adminName: data.person });
      else this.setState({ isTyping: false });
    });

    socket.on("disconnect", () => {
      this.setState({
        disabled: !this.state.disabled ? true : this.state.disabled,
        reconnectFailed: false
      });
    });

    socket.on("reconnect", () => {
      setTimeout(() => {
        console.log("Reconnected!");
        this.setState({
          disabled: this.state.disabled ? false : this.state.disabled,
          reconnectFailed: false
        });
        if (active && this.props.roomId)
          socket.emit("add user", {
            roomId: this.props.roomId
          });
      }, 4000);
    });

    socket.on("reconnect_failed", () => {
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
    const { roomId } = this.props;
    if (e.charCode === 13) {
      let el = document.createElement("div");
      el.textContent = this.state.messageText;
      let cleanedMessage = el.textContent;
      if (cleanedMessage) {
        this.setState({ messageText: "" });
        let time = "" + new Date();
        socket.emit("chat message", {
          roomId: "null",
          msg: cleanedMessage,
          timestamp: time
        });
      }
      clearTimeout(this.timeout);
      this.timeoutFunction();
    } else {
      if (
        this.typing === false &&
        document.activeElement ===
          ReactDOM.findDOMNode(this.inputMessageRef.current)
      ) {
        this.typing = true;
        socket.emit("typing", {
          isTyping: true,
          roomId: roomId,
          person: "Client"
        });
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.timeoutFunction, 2000);
      }
    }
  }

  handleChange(e) {
    this.setState({ messageText: e.target.value });
  }

  timeoutFunction() {
    const { roomId } = this.props;
    this.typing = false;
    socket.emit("typing", {
      isTyping: false,
      roomId: roomId,
      person: "Client"
    });
  }

  render() {
    const { roomId } = this.props;
    const {
      disabled,
      reconnectFailed,
      messageText,
      messages,
      isTyping,
      adminName
    } = this.state;
    let inputBoxPlaceholder = "";
    if (disabled) {
      inputBoxPlaceholder = "Connection Lost! Reconnecting..";
    } else if (reconnectFailed) {
      inputBoxPlaceholder = "No active connection. Please refresh page.";
    } else {
      inputBoxPlaceholder = "Type here...";
    }

    return (
      <SlideToggle
        duration={500}
        collapsed
        render={({ onToggle, setCollapsibleElement }) => (
          <div className="msg_box">
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
                  {messages.map(message => {
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
                  <div className="msg_push_new" />
                </div>
                {isTyping ? (
                  <div className="typing">
                    {adminName ? adminName : "Adrent"} is typing...
                  </div>
                ) : null}
                <input
                  disabled={disabled}
                  className="inputMessage"
                  ref={this.inputMessageRef}
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

export default Chat;

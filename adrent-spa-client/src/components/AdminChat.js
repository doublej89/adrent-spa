import React, { Component } from "react";
import { connect } from "react-redux";
import "./AdminChat.css";
import _ from "lodash";
import io from "socket.io-client";
const socketUrl = "http://localhost:5000";
const socket = io(socketUrl);

class AdminChat extends Component {
  constructor(props) {
    super(props);
    //this.messagesRef = React.createRef();
    this.state = {
      clients: [],
      messageTexts: {},
      connected: false,
      disconnectedUser: "",
      reconnectFailed: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.notifyAdmin = this.notifyAdmin.bind(this);
  }

  componentDidMount() {
    const { username, authenticated } = this.props;

    socket.on("connect", () => {
      console.log("Connected");
      this.setState({
        reconnectFailed: this.state.reconnectFailed
          ? false
          : this.state.reconnectFailed
      });
    });

    if (authenticated && username) {
      socket.emit("add admin", {
        admin: username,
        isAdmin: true
      });
      this.setState({ connected: true });
    }

    socket.on("New Client", data => {
      console.log(data);

      const clientAdded = this.state.clients.some(
        client => client.roomId == data.roomId
      );
      const idAdded = Object.keys(this.state.messageTexts).includes(
        data.roomId
      );

      if (!clientAdded) {
        this.setState({
          clients: [...this.state.clients, data],
          disconnectedUser:
            data.roomId == this.state.disconnectedUser
              ? ""
              : this.state.disconnectedUser,
          messageTexts: !idAdded
            ? { ...this.state.messageTexts, [data.roomId]: "" }
            : this.state.messageTexts
        });
      }

      if (!data.justJoined) {
        this.notifyAdmin(
          "New Client",
          "Hey there!" + data.details.username + " needs help!"
        );
      }
    });

    socket.on("reconnect", () => {
      console.log("Reconnected!");
      //$userList.empty();
      this.setState({
        clients: [],
        disconnectedUser: false,
        reconnectFailed: false
      });
      //$errorPage.fadeOut();
      //$userList.append("<li id=" + username + ">" + username + "</li>");
      if (authenticated) {
        socket.emit("add admin", {
          admin: username,
          isAdmin: true
        });
        this.setState({ connected: true });
      }
    });

    socket.on("chat message", data => {
      this.state.clients
        .find(client => client.roomId == data.roomId)
        .history.push(data);
      this.setState({
        clients: [...this.state.clients]
      });
    });

    socket.on("disconnect", () => {
      this.setState({
        reconnectFailed: false,
        connected: false
      });
    });

    socket.on("User Disconnected", roomId => {
      this.setState({ disconnectedUser: roomId });
    });

    socket.on("reconnect_failed", () => {
      this.setState({ reconnectFailed: true });
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { disconnectedUser } = this.state;
    if (disconnectedUser) {
      this.setState({
        clients: this.state.clients.filter(cl => cl.roomId != disconnectedUser),
        messageTexts: _.omit(this.state.messageTexts, disconnectedUser)
      });
    }
  }

  notifyAdmin(title, body) {
    if (Notification.permission === "granted") {
      Notification.requestPermission();
    } else {
      var notification = new Notification(title, {
        icon: "",
        body: body
      });
      notification.onclick = () => {
        window.focus();
        this.cancel();
      };
    }
  }

  handleChange(e) {
    const roomId = e.target.id;
    this.setState({
      messageTexts: { ...this.state.messageTexts, [roomId]: e.target.value }
    });
  }

  isTyping(e) {
    const roomId = e.target.id;
    if (e.keyCode === 13) {
      let el = document.createElement("div");
      el.textContent = this.state.messageTexts[roomId];
      let cleanedMessage = el.textContent;
      if (cleanedMessage && this.state.connected) {
        this.setState({
          messageTexts: { ...this.state.messageTexts, [roomId]: "" }
        });
        let time = "" + new Date();
        //this.setState({ newMessage: { msg: cleanedMessage, timestamp: time } });
        socket.emit("chat message", {
          roomId: roomId,
          msg: cleanedMessage,
          timestamp: time
        });
      }
    }
  }

  render() {
    const { reconnectFailed, clients, disconnectedUser } = this.state;
    console.log(clients);
    const clientInterfaces = clients.map(client => {
      let chatAreaStyle;
      if (!client.justJoined) {
        chatAreaStyle = { border: "2px solid red" };
      } else {
        chatAreaStyle = { border: "1px solid #000" };
      }
      return (
        <div className="adminChatArea" style={chatAreaStyle}>
          <div className="adminChatHeader">
            {client.details.username}, {client.details.email}
          </div>
          <ul className="adminMessages">
            {client.history.map(message => (
              <li className="message">
                <span className="username">
                  {message.isAdmin ? "You" : "Client"}
                </span>
                <span className="messageBody">{message.msg}</span>
                <span className="adminTimestamp">{message.timestamp}</span>
              </li>
            ))}
          </ul>
          <div className="typing" />
          <input
            className="adminInputMessage"
            id={client.roomId}
            placeholder="Type here..."
            onKeyPress={this.isTyping}
            onChange={this.handleChange}
          />
        </div>
      );
    });

    return (
      <ul className="pages">
        <li className="chat page">
          <div className="container">{clientInterfaces}</div>
        </li>
        {disconnectedUser || reconnectFailed ? (
          <li className="error page">
            <div className="form">
              <h3 className="adminTitle">
                {reconnectFailed
                  ? "Reconection Failed. Please refresh your page."
                  : "Reconnecting..."}
              </h3>
            </div>
          </li>
        ) : null}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  username: state.auth.username
});

export default connect(mapStateToProps)(AdminChat);

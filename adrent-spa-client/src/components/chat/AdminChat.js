import React, { Component } from "react";
import { connect } from "react-redux";
import "./AdminChat.css";
import _ from "lodash";
//import io from "socket.io-client";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MessageList from "./MessageList";
import isEmpty from "../../utils/isEmpty";

// const socketUrl = "http://localhost:5000";
// const socket = io(socketUrl);

const styles = theme => ({
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  }
});

class AdminChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {},
      messageTexts: {},
      connected: false,
      disconnectedUser: "",
      reconnectFailed: false,
      clientFocusState: {},
      clientTyping: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.isTyping = this.isTyping.bind(this);
    this.notifyAdmin = this.notifyAdmin.bind(this);
    this.typing = false;
    this.timeout = undefined;
  }

  componentDidMount() {
    const { username, authenticated, socket } = this.props;

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
      if (!this.state.clients[data.roomId]) {
        this.setState({
          clients: { ...this.state.clients, [data.roomId]: data },
          messageTexts: { ...this.state.messageTexts, [data.roomId]: "" },
          disconnectedUser:
            data.roomId == this.state.disconnectedUser
              ? ""
              : this.state.disconnectedUser,
          clientFocusState: {
            ...this.state.clientFocusState,
            [data.roomId]: { focused: false }
          },
          clientTyping: {
            ...this.state.clientTyping,
            [data.roomId]: { isTyping: false, person: "" }
          }
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
      this.setState({
        clients: {},
        messageTexts: {},
        connected: false,
        disconnectedUser: "",
        reconnectFailed: false,
        clientFocusState: {},
        clientTyping: {}
      });

      if (authenticated) {
        socket.emit("add admin", {
          admin: username,
          isAdmin: true
        });
        this.setState({ connected: true });
      }
    });

    socket.on("chat message", data => {
      const { clients } = this.state;

      const message = {
        isAdmin: data.isAdmin,
        msg: data.msg,
        username: data.username ? data.username : null,
        timestamp: data.timestamp
      };
      this.setState({
        clients: {
          ...clients,
          [data.roomId]: {
            ...clients[data.roomId],
            history: [...clients[data.roomId].history, message]
          }
        }
      });
    });

    socket.on("typing", data => {
      if (data.isTyping)
        this.setState({
          clientTyping: {
            ...this.state.clientTyping,
            [data.roomId]: { isTyping: true, person: data.person }
          }
        });
      else
        this.setState({
          clientTyping: {
            ...this.state.clientTyping,
            [data.roomId]: { isTyping: false, person: "" }
          }
        });
    });

    socket.on("disconnect", () => {
      this.setState({
        reconnectFailed: false,
        connected: false
      });
    });

    socket.on("User Disconnected", roomId => {
      console.log("disconnected user: " + roomId);
      this.setState({
        clients: _.omit(this.state.clients, roomId),
        messageTexts: _.omit(this.state.messageTexts, roomId),
        clientFocusState: _.omit(this.state.clientFocusState, roomId),
        clientTyping: _.omit(this.state.clientTyping, roomId),
        disconnectedUser: roomId
      });
    });

    socket.on("reconnect_failed", () => {
      this.setState({ reconnectFailed: true });
    });
  }

  componentDidUpdate() {
    if (!this.props.authenticated) {
      this.props.history.push("/");
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

  timeoutFunction = id => {
    this.typing = false;
    this.props.socket.emit("typing", {
      isTyping: false,
      roomId: id,
      person: this.props.username
    });
  };

  isTyping(e) {
    const roomId = e.target.id;
    const { focused } = this.state.clientFocusState[roomId];
    if (e.charCode === 13) {
      let el = document.createElement("div");
      el.textContent = this.state.messageTexts[roomId];
      let cleanedMessage = el.textContent;

      if (cleanedMessage && this.state.connected) {
        this.setState({
          messageTexts: { ...this.state.messageTexts, [roomId]: "" }
        });
        let time = "" + new Date();

        this.props.socket.emit("chat message", {
          roomId: roomId,
          msg: cleanedMessage,
          timestamp: time
        });
      }
      clearTimeout(this.timeout);
      this.timeoutFunction(roomId);
    } else if (e.charCode !== undefined) {
      if (this.typing === false && focused) {
        this.typing = true;
        this.props.socket.emit("typing", {
          isTyping: true,
          roomId: roomId,
          person: this.props.username
        });
      } else {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.timeoutFunction(roomId);
        }, 2000);
      }
    }
  }

  render() {
    const {
      reconnectFailed,
      clients,
      disconnectedUser,
      messageTexts,
      clientTyping
    } = this.state;

    const { classes } = this.props;

    const clientInterfaces = Object.values(clients).map(client => {
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
          <MessageList client={client} />
          {clientTyping[client.roomId].isTyping &&
          clientTyping[client.roomId].person ? (
            <div className="typing">
              <small>{clientTyping[client.roomId].person} is typing...</small>
            </div>
          ) : null}
          <input
            className="adminInputMessage"
            id={client.roomId}
            placeholder="Type here..."
            onKeyPress={this.isTyping}
            onChange={this.handleChange}
            onFocus={() =>
              this.setState({
                clientFocusState: {
                  ...this.clientFocusState,
                  [client.roomId]: { focused: true }
                }
              })
            }
            onBlur={() =>
              this.setState({
                clientFocusState: {
                  ...this.clientFocusState,
                  [client.roomId]: { focused: false }
                }
              })
            }
            value={messageTexts[client.roomId]}
          />
        </div>
      );
    });

    return (
      <div>
        <div className={classes.heroUnit}>
          <div className={classes.heroContent}>
            <Typography
              component="h2"
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Clients Online
            </Typography>
          </div>
        </div>
        <ul className="pages">
          <li className="chat page">
            <div className="container">
              {!isEmpty(clients) ? (
                clientInterfaces
              ) : (
                <Typography
                  variant="h6"
                  align="center"
                  color="textPrimary"
                  paragraph
                >
                  No clients are online
                </Typography>
              )}
            </div>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  username: state.auth.username
});

export default connect(mapStateToProps)(withStyles(styles)(AdminChat));

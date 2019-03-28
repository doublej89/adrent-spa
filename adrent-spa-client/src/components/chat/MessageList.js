import React, { Component } from "react";
import * as ReactDOM from "react-dom";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.messagesRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    let historyHasChanged =
      this.props.client.history.length !== prevProps.client.history.length;
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

  scrollToBottom = () => {
    const maxScrollTop =
      this.messagesRef.current.scrollHeight -
      this.messagesRef.current.clientHeight;
    ReactDOM.findDOMNode(this.messagesRef.current).scrollTop =
      maxScrollTop > 0 ? maxScrollTop : 0;
  };

  render() {
    const { client } = this.props;
    return (
      <ul ref={this.messagesRef} className="adminMessages">
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
    );
  }
}

export default MessageList;

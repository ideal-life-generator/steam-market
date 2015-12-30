import React, { Component } from "react";
import Header from "./Header";
import { generate } from "shortid"
import cookie from "cookie"

class Session {
  constructor () {
    let cookieObj = cookie.parse(document.cookie)
    if (cookieObj.sessionId) {
      this.sessionId = cookieObj.sessionId
    }
    else {
      this.sessionId = generate()
      document.cookie = `sessionId=${this.sessionId};`
    }
  }

  getSessionId () {
    return this.sessionId
  }
}

let session = new Session()

var socket = new WebSocket("ws://localhost:5001")
socket.addEventListener("message", function (event) {
  console.log(event.data);
})
socket.addEventListener("open", function (event) {
  socket.send(JSON.stringify({ code: 555 }))
})

class Main extends Component {
  render () {
    return (
      <div>
        <Header />
      </div>
    )
  }
}

export default Main;
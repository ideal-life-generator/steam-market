import { parse as cookieParse } from "cookie"
import { generate as generateId } from "shortid"

class WsSession {
  constructor (serverUrl) {
    const cookieObj = cookieParse(document.cookie)
    if (cookieObj.wsSessionId) {
      this.wsSessionId = cookieObj.wsSessionId
    }
    else {
      this.wsSessionId = generateId()
      document.cookie = `wsSessionId=${this.wsSessionId};`
    }
    this.firsts = [ ]
    const firsts = this.firsts
    this.webSocket = new WebSocket(serverUrl)
    const webSocket = this.webSocket
    webSocket.addEventListener("open", function () {
      firsts.forEach((messageJSON) => {
        webSocket.send(messageJSON)
      })
    })
  }
  // first (eventName, data) {
  //   const firsts = this.firsts
  //   const message = {
  //     eventName: eventName,
  //     data: data
  //   }
  //   const messageJSON = JSON.stringify(message)
  //   firsts.push(messageJSON)
  // }
  on (eventName, onCallback) {
    let webSocket = this.webSocket
    webSocket.addEventListener("message", (event) => {
      const messageJSON = event.data
      const message = JSON.parse(messageJSON)
      const remoteEventName = message.eventName
      const messageData = message.data
      if (eventName === remoteEventName) {
        onCallback(messageData)
      }
    })
  }
  to (eventName, data) {
    let webSocket = this.webSocket
    const message = {
      eventName: eventName,
      data: data
    }
    const messageJSON = JSON.stringify(message)
    webSocket.send(messageJSON)
  }
}

export default WsSession
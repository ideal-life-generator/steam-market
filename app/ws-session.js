import { parse as cookieParse } from "cookie"
import { generate as generateId } from "shortid"

class WsSession {
  constructor (serverUrl) {
    const defaults = {
      isReady: false,
      queue: [ ]
    }
    Object.assign(this, defaults)
    const cookieObj = cookieParse(document.cookie)
    if (cookieObj.sessionId) {
      this.sessionId = cookieObj.sessionId
    }
    else {
      this.sessionId = generateId()
      document.cookie = `sessionId=${this.sessionId};`
    }
    this.webSocket = new WebSocket(serverUrl)
    this.webSocket.addEventListener("open", () => {
      this.isReady = true
      this.queue.forEach((messageJSON) => {
        this.webSocket.send(messageJSON)
      })
      this.queue.length = 0
    })
  }
  on (eventName, onCallback) {
    this.webSocket.addEventListener("message", (event) => {
      const messageJSON = event.data
      const message = JSON.parse(messageJSON)
      const remoteEventName = message.eventName
      if (eventName === remoteEventName) {
        const messageData = message.data
        onCallback.apply(this, messageData)
      }
    })
  }
  to (eventName, data, callback) {
    const message = {
      eventName: eventName,
      data: data
    }
    const messageJSON = JSON.stringify(message)
    if (this.isReady) {
      this.webSocket.send(messageJSON)
    }
    else {
      this.queue.push(messageJSON)
    }
    if (Boolean(callback)) {
      callback
    }
  }
}

export default WsSession
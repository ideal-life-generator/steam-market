import { parse } from "cookie"
import { randomBytes } from "crypto"

let handlers = [ ]
class WsSession {
  constructor (serverUrl) {
    const cookieObj = parse(document.cookie)
    if (cookieObj.wsSessionId) {
      this.wsSessionId = cookieObj.wsSessionId
    }
    else {
      this.wsSessionId = randomBytes(16, "base64").toString("base64")
      document.cookie = `wsSessionId=${this.wsSessionId};`
    }
    this.webSocket = new WebSocket(serverUrl)
  }
  ready (callback) {
    let handler = () => {
      callback()
      this.off(handlerId)
      // this.webSocket.removeEventListener("open", callback)
    }
    this.webSocket.addEventListener("open", handler)
    const handlerId = handlers.push(handler)-1
    return handlerId
  }
  once (eventName, callback) {
    let handler = () => {
      callback()
      this.off(handlerId)
    }
    const handlerId = this.on(eventName, handler)
    return handlerId
  }
  on (eventName, callback) {
    function handler (event) {
      const { data: messageJSON } = event
      const message = JSON.parse(messageJSON)
      const { remoteEventName, messageData } = message
      if (eventName === remoteEventName) {
        callback.apply(null, messageData)
      }
    }
    this.webSocket.addEventListener("message", handler)
    return handlers.push(handler)-1
  }
  off () {
    Array.prototype.forEach.call(arguments, (handlerId) => {
      if (Boolean(handlers[handlerId])) {
        this.webSocket.removeEventListener("message", handlers[handlerId])
        handlers.splice(handlerId, 1)
      }
    })
  }
  to (eventName, data) {
    const message = {
      eventName: eventName,
      data: data
    }
    const messageJSON = JSON.stringify(message)
    this.webSocket.send(messageJSON)
  }
}

export default WsSession
import { parse } from "cookie"
import { generate } from "shortid"

function connect (connectUrl) {
  let webSocket = new WebSocket(connectUrl)
  const cookieObj = parse(document.cookie)
  let { wsSessionId: sessionId } = cookieObj
  if (!Boolean(sessionId)) {
    sessionId = generate()
    document.cookie = `wsSessionId=${sessionId};`
  }
  function connected (callback) {
    let handler = () => {
      callback()
      webSocket.removeEventListener("open", handler)
    }
    webSocket.addEventListener("open", handler)
    return () => {
      webSocket.removeEventListener("open", handler)
    }
  }
  function subscribeOnce (eventName, callback) {
    function handler () {
      callback.apply(null, arguments)
      unsubscribe()
    }
    let unsubscribe = subscribe(eventName, handler)
    return unsubscribe
  }
  function subscribe (eventName, callback) {
    function handler (event) {
      const { data: messageJSON } = event
      const message = JSON.parse(messageJSON)
      const { eventName: remoteEventName, data: data } = message
      if (eventName === remoteEventName) {
        callback.apply(null, data)
      }
    }
    webSocket.addEventListener("message", handler)
    return () => {
      webSocket.removeEventListener("message", handler)
    }
  }
  function send (eventName, data) {
    const message = { eventName, data }
    const messageJSON = JSON.stringify(message)
    webSocket.send(messageJSON)
  }
  return {
    sessionId,
    webSocket,
    connected,
    subscribeOnce,
    subscribe,
    send
  }
}

export { connect }
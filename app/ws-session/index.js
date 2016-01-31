import { parse } from "cookie"
import { generate } from "shortid"

function session (url) {
  const cookieObj = parse(document.cookie)
  let { socketSessionId } = cookieObj  
  if (!Boolean(socketSessionId)) {
    socketSessionId = generate()
    document.cookie = `socketSessionId=${socketSessionId};`
  }

  let webSocket = new WebSocket(url)

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

  function subscribe (identifier, callback) {
    function handler (event) {
      const { data: messageJSON } = event
      const message = JSON.parse(messageJSON)
      const { identifier: remoteidentifier, data: data } = message
      if (identifier === remoteidentifier) {
        callback.apply(null, data)
      }
    }
    webSocket.addEventListener("message", handler)
    return () => {
      webSocket.removeEventListener("message", handler)
    }
  }

  function send (identifier, ...data) {
    const message = { identifier, data }
    const messageJSON = JSON.stringify(message)
    webSocket.send(messageJSON)
  }

  return {
    socketSessionId,
    webSocket,
    connected,
    // subscribeOnce,
    subscribe,
    send
  }
}

export default session
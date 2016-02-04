import { parse } from "cookie"
import { generate } from "shortid"

function session (url) {
  const connects = new Set()
  const subscribes = new Map()

  const cookieObj = parse(document.cookie)
  let { socketSessionId } = cookieObj  
  if (Boolean(socketSessionId) === false) {
    socketSessionId = generate()
    document.cookie = `socketSessionId=${socketSessionId};`
  }

  const webSocket = new WebSocket(url)

  webSocket.addEventListener("open", () => {
    connects.forEach((callback) => {
      callback()
    })
  })

  webSocket.addEventListener("message", (event) => {
    const { data: messageJSON } = event
    const { identifier, data } = JSON.parse(messageJSON)
    const callback = subscribes.get(identifier)
    if (Boolean(callback)) {
      callback.apply(null, data)
    }
  })

  function connected (callback) {
    connects.add(callback)
    return function unsubscribe () {
      connects.delete(callback)
    }
  }

  function send (identifier, ...data) {
    webSocket.send(JSON.stringify({ identifier, data }))
  }

  function subscribe (identifier, callback) {
    subscribes.set(identifier, callback)
    return function unsubscribe () {
      subscribes.delete(identifier)
    }
  }

  function subscribeOnce (identifier, callback) {
    function handler () {
      callback.apply(null, arguments)
      unsubscribe()
    }
    const unsubscribe = subscribe(identifier, handler)
    return unsubscribe
  }

  return {
    socketSessionId,
    webSocket,
    connected,
    send,
    subscribe,
    subscribeOnce
  }
}

export default session
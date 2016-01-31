import { Server } from "ws"
import { parse as cookieParse } from "cookie"

function sessions (settings, callback) {
  const wsServer = new Server(settings)

  const sockets = new Set()
  const sessions = new Map()

  const identifiers = new Map()

  wsServer.on("connection", (socket) => {
    sockets.add(socket)

    const { upgradeReq: { headers: { cookie } } } = socket
    const { socketId, socketSessionId } = cookieParse(cookie)
    
    if (sessions.has(socketSessionId) === false) {
      sessions.set(socketSessionId, new Set())
    }
    const currentSession = sessions.get(socketSessionId)
    currentSession.add(socket)

    socket.on("message", (messageJSON) => {
      const { identifier, data } = JSON.parse(messageJSON)
      if (identifiers.has(identifier)) {
        const callback = identifiers.get(identifier)
        callback.apply(null, data)
      }
    })

    socket.on("close", () => {
      sockets.delete(socket)
      currentSession.delete(socket)
      if (currentSession.size === 0) {
        sessions.delete(socketSessionId)
      }
      socket.terminate()
    })

    callback({
      current: current.bind(null, socket),
      session: session.bind(null, currentSession),
      all,
      subscribe,
      socketSessionId,
      socket
    })
  })

  function current (socket, identifier, ...data) {
    socket.send(JSON.stringify({ identifier, data }))
  }

  function session (session, identifier, ...data) {
    const messageJSON = JSON.stringify({ identifier, data })
    session.forEach((socket) => {
      socket.send(messageJSON)
    })
  }

  function all (identifier, ...data) {
    const messageJSON = JSON.stringify({ identifier, data })
    sockets.forEach((socket) => {
      socket.send(messageJSON)
    })
  }

  function subscribe (identifier, callback) {
    identifiers.set(identifier, callback)
  }

  return {
    wsServer
  }
}

export default sessions
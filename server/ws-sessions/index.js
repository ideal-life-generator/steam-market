import { parse } from "cookie"
import { generate } from "shortid"

function sessions (wsServer, callback) {
  const sockets = new Map()
  const sessions = new Map()

  const identifiers = new Map()

  function connections (callback) {
    wsServer.on("connection", (socket) => {
      const { upgradeReq: { headers: { cookie } } } = socket
      const { socketSessionId } = parse(cookie)

      const socketId = generate()
      sockets.set(socketId, socket)
  
      if (sessions.has(socketSessionId) === false) {
        sessions.set(socketSessionId, new Set())
      }
      
      {
        const session = sessions.get(socketSessionId)
        session.add(socket)

        socket.on("message", (messageJSON) => {
          const { identifier, data } = JSON.parse(messageJSON)
          if (identifiers.has(identifier)) {
            const callback = identifiers.get(identifier)
            callback.apply(null, data)
          }
        })

        socket.on("close", () => {
          sockets.delete(socketId)
          session.delete(socket)
          if (session.size === 0) {
            sessions.delete(socketSessionId)
          }
          socket.terminate()
        })
      }

      callback({
        current: single.bind(null, socketId),
        currentSession: session.bind(null, socketSessionId),
        exceptCurrent: exceptSingle.bind(null, socketId),
        exceptCurrentSession: exceptSession.bind(null, socketSessionId),
        socketId,
        socketSessionId,
        socket
      })
    })
  }

  function single (socketId, identifier, ...data) {
    const socket = sockets.get(socketId)
    socket.send(JSON.stringify({ identifier, data }))
  }

  function session (socketSessionId, identifier, ...data) {
    const session = sessions.get(socketSessionId)
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

  function exceptSingle (socketId, identifier, ...data) {
    const messageJSON = JSON.stringify({ identifier, data })
    sockets.forEach((socket, id) => {
      if (id !== socketId) {
        socket.send(messageJSON)
      }
    })
  }

  function exceptSession (socketSessionId, identifier, ...data) {
    const messageJSON = JSON.stringify({ identifier, data })
    sessions.forEach((session, id) => {
      if (id !== socketSessionId) {
        session.forEach((socket) => {
          socket.send(messageJSON)
        })
      }
    })
  }

  function subscribe (identifier, callback) {
    identifiers.set(identifier, callback)
  }

  return {
    connections,
    single,
    session,
    all,
    exceptSingle,
    exceptSession,
    subscribe
  }
}

export default sessions
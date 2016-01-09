import { parse as cookieParse } from "cookie"

class WsSessions {
  static getSessionId (socket) {
    try {
      const { upgradeReq: { headers: { cookie: socketCookie } } } = socket
      const { wsSessionId: sessionId } = cookieParse(socketCookie)
      return sessionId
    }
    catch (error) { throw error }
  }
  constructor (socketServer) {
    try {
      this.sockets = [ ]
      // this.firsts = [ ]
      this.sessions = { }
      this.events = [ ]
      const sockets = this.sockets
      // const firsts = this.firsts
      const sessions = this.sessions
      const events = this.events
      socketServer.on("connection", (socket) => {
        /*
    
          What about closers?
  
        */
        sockets.push(socket)
        // firsts.forEach((currentMessageJSON) => {
        //   socket.send(currentMessageJSON)
        // })
        const sessionId = WsSessions.getSessionId(socket)
        if (!sessions[sessionId]) sessions[sessionId] = [ ]
        const currentSession = sessions[sessionId]
        currentSession.push(socket)
        events.forEach(({ eventName, onCallback }) => {
          socket.on("message", (currentMessageJSON) => {
            const currentMessage = JSON.parse(currentMessageJSON)
            const remoteEventName = currentMessage.eventName
            const messageData = currentMessage.data
            if (remoteEventName === eventName) {
              onCallback(messageData, sessionId)
            }
          })
        })
        socket.on("close", () => {
          const socketIndex = sockets.indexOf(socket)
          sockets.splice(socketIndex, 1)
          const socketIndexSession = currentSession.indexOf(socket)
          currentSession.splice(socketIndexSession, 1)
          socket.close()
          socket.terminate()
        })
      })
    }
    catch (error) { throw error }
  }
  // first (eventName, data) {
  //   try {
  //     const firsts = this.firsts
  //     const currentMessage = {
  //       eventName: eventName,
  //       data: data
  //     }
  //     const currentMessageJSON = JSON.stringify(currentMessage)
  //     firsts.push(currentMessageJSON)
  //   }
  //   catch (error) { throw error }
  // }
  on (eventName, onCallback) {
    try {
      const events = this.events
      const event = {
        eventName: eventName,
        onCallback: onCallback
      }
      events.push(event)
    }
    catch (error) { throw error }
  }
  to (sessionId, eventName) {
    try {
      const data = Array.prototype.slice.call(arguments, 2)
      if (!!sessionId) {
        const sessions = this.sessions
        const currentSession = sessions[sessionId]
        currentSession.forEach((socket) => {
          const currentMessage = {
            eventName: eventName,
            data: data
          }
          const currentMessageJSON = JSON.stringify(currentMessage)
          socket.send(currentMessageJSON)
        })
      }
      else {
        const sockets = this.sockets
        sockets.forEach((socket) => {
          const currentMessage = {
            eventName: eventName,
            data: data
          }
          const currentMessageJSON = JSON.stringify(currentMessage)
          socket.send(currentMessageJSON)
        })
      }
    }
    catch (error) { throw error }
  }
}

export default WsSessions
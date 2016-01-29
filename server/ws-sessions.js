import { parse as cookieParse } from "cookie"

class WsSessions {
  static getSessionId (socket) {
    try {
      const { upgradeReq: { headers: { cookie: socketCookie } } } = socket
      const { wsSessionId: wsSessionId } = cookieParse(socketCookie)
      return wsSessionId
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
        const wsSessionId = WsSessions.getSessionId(socket)
        if (!sessions[wsSessionId]) sessions[wsSessionId] = [ ]
        const currentSession = sessions[wsSessionId]
        currentSession.push(socket)
        events.forEach(({ eventName, onCallback }) => {
          socket.on("message", (currentMessageJSON) => {
            const currentMessage = JSON.parse(currentMessageJSON)
            const remoteEventName = currentMessage.eventName
            const messageData = currentMessage.data
            if (remoteEventName === eventName) {
              onCallback(messageData, wsSessionId)
            }
          })
        })
        socket.on("close", () => {
          const socketIndex = sockets.indexOf(socket)
          sockets.splice(socketIndex, 1)
          const socketIndexSession = currentSession.indexOf(socket)
          currentSession.splice(socketIndexSession, 1)
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
    const data = Array.prototype.slice.call(arguments, 2)
    // let messages = data.map((message, id) => {
    //   if (Boolean(message)) {
    //     return message
    //   }
    // })
    const message = {
      eventName,
      data
    }
    const messageJSON = JSON.stringify(message)
    if (Boolean(sessionId)) {
      const { [ sessionId ]: session } = this.sessions
      session.forEach((socket) => {
        socket.send(messageJSON)
      })
    }
    else {
      socket.send(messageJSON)
    }
      // if (!!wsSessionId) {
      //   const currentSession = sessions[wsSessionId]
      //   currentSession.forEach((socket) => {
      //     const message = {
      //       eventName: eventName,
      //       data: data
      //     }
      //     const messageJSON = JSON.stringify(currentMessage)
      //     socket.send(currentMessageJSON)
      //   })
      // }
      // else {
      //   const sockets = this.sockets
      //   sockets.forEach((socket) => {
      //     const currentMessage = {
      //       eventName: eventName,
      //       data: data
      //     }
      //     const currentMessageJSON = JSON.stringify(currentMessage)
      //     socket.send(currentMessageJSON)
      //   })
      // }
  }
}

export default WsSessions
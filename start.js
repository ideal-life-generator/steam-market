import { createServer } from "http"
import { Server } from "ws"
import sessions from "./server/ws-sessions"
import pg from "pg"

import { HTTP_SERVER_PATH, HTTP_SERVER_PORT, DB_SERVER_PATH, SOCKET_SERVER_PORT } from "./config"


import fileStream from "./server/api/file-stream"

createServer((req, res) => {
  fileStream(req, res)
}).listen(HTTP_SERVER_PORT, HTTP_SERVER_PATH, () => {
  console.info(`HTTP server is listening on ${HTTP_SERVER_PATH}:${HTTP_SERVER_PORT}`)
})


import signin from "./server/api/signin"
import userCheck from "./server/api/user-check"

pg.connect(DB_SERVER_PATH, (error, db, done) => {
  if (error) { throw error }
  else {
    const wsServer = new Server({ port: SOCKET_SERVER_PORT })
    const { connections, single, session, all, exceptSingle, exceptSession, subscribe } = sessions(wsServer)
    connections(({ current, currentSession, exceptCurrent, exceptCurrentSession, socketId, socketSessionId, socket }) => {
      signin(currentSession, subscribe, db)
      userCheck(currentSession, subscribe, db)
    })
  }
})
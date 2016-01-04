import { createServer as httpServer } from "http"
import { Server as WebSocketServer } from "ws"
import pg from "pg"
import { Sessions as WebSocketsSessions } from "./server/ws-sessions"

import { PORT_HTTP_SERVER, PATH_HTTP_SERVER, PATH_DB_SERVER, PORT_SOCKET_SERVER } from "./config"

import { file as fileHTTP } from "./server/http/file"
import { signin as signinSockets } from "./server/sockets/signin"

const serverHTTP = httpServer((req, res) => {
  fileHTTP(req, res)
})

serverHTTP.listen(PORT_HTTP_SERVER, PATH_HTTP_SERVER, () => {
  console.log(`HTTP server is listened on ${PATH_HTTP_SERVER}:${PORT_HTTP_SERVER}`)
})

const serverSocket = new WebSocketServer({ port: PORT_SOCKET_SERVER })
const webSocketsSessions = new WebSocketsSessions(serverSocket)

pg.connect(PATH_DB_SERVER, (error, db, done) => {
  if (error) { throw error }
  else {
    signinSockets(webSocketsSessions, db)
  }
})
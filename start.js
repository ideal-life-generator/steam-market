import http from "http"
import ws from "ws"
import WsSessions from "./server/ws-sessions"
import pg from "pg"
import fileStream from "./server/api/file-stream"
import signin from "./server/api/signin"
import { PORT_HTTP_SERVER, PATH_HTTP_SERVER, PATH_DB_SERVER, PORT_SOCKET_SERVER } from "./config"

const httpServer = http.createServer((req, res) => {
  fileStream(req, res)
}).listen(PORT_HTTP_SERVER, PATH_HTTP_SERVER, () => {
  console.log(`HTTP server is listened on ${PATH_HTTP_SERVER}:${PORT_HTTP_SERVER}`)
})

const socketServer = new ws.Server({ port: PORT_SOCKET_SERVER })
const wsSessions = new WsSessions(socketServer)


import user from "./server/db/user"

pg.connect(PATH_DB_SERVER, (error, db, done) => {
  if (error) { throw error }
  else {
    signin(wsSessions, db)
    wsSessions.on("user.check", ({ steamId, token }, sessionId) => {
      console.log(steamId, token)
      user.checkToken(db, steamId, token, (isExist) => {
        console.log(isExist)
      })
    })
  }
})
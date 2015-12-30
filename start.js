import { createServer as httpServer } from "http"
import url from "url"
import querystring from "querystring"
import { Server as WebSocketServer } from "ws"
import { checkSupportTemplate, checkSupportFile } from "./server/utilites"
import { PORT_HTTP_SERVER, PATH_HTTP_SERVER, PORT_SOCKET_SERVER, PATH_APP } from "./config"
import { loadTemplate, loadFile } from "./server/load"
import { signinCheckUser } from "./server/socket/signin"

const serverREST = httpServer((req, res) => {
  const fullUrl = req.url
  const urlParsed = url.parse(fullUrl)
  const pathname = urlParsed.pathname
  const urlQuery = urlParsed.query
  const query = querystring.parse(urlQuery)
  const isSupportedTemplate = checkSupportTemplate(pathname)
  if (isSupportedTemplate) {
    loadTemplate(res, isSupportedTemplate.path)
  }
  else if (!urlQuery) {
    const isSupportedFile = checkSupportFile(pathname)
    if (isSupportedFile) {
      loadFile(res, pathname)
    }
  }
})

serverREST.listen(PORT_HTTP_SERVER, PATH_HTTP_SERVER, () => {
  console.log(`Http rest server is listened on ${PATH_HTTP_SERVER}:${PORT_HTTP_SERVER}`)
})



const serverSocket = new WebSocketServer({ port: PORT_SOCKET_SERVER })

serverSocket.on("connection", (socket) => {
  socket.on("message", (messageJSON) => {
    try {
      const message = JSON.parse(messageJSON)
      switch (message.code) {
        case 0:
          const signinQuery = message.data
          signinCheckUser(serverSocket.clients, socket, signinQuery)
          break
      }
    }
    catch (error) { throw error }
  });
});
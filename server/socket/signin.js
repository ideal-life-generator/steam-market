import { parse as cookieParse } from "cookie"
import { parse as querystringParse, stringify as querystringStringify } from "querystring"
import { get } from "./../request"

function signinCheckUser (clients, socket, signinQuery) {
  try {
    const { upgradeReq: { headers: { cookie: socketCookie } } } = socket
    const { sessionId: socketSessionId } = cookieParse(socketCookie)
    const signinQueryCorrect = signinQuery.replace("+", "%2B")
    const signinQueryParsed = querystringParse(signinQueryCorrect)
    const signinQueryCheckParsed = {
      ...signinQueryParsed,
      "openid.mode": "check_authentication"
    }
    const signinQueryCheck = querystringStringify(signinQueryCheckParsed)
    get(signinQueryCheck, (result) => {
      const isValid = (/is_valid:true/).test(result)
      const message = isValid ? {
        code: 1
      } : {
        code: 2
      }
      const messageJSON = JSON.stringify(message)
      clients.forEach((client) => {
        const { upgradeReq: { headers: { cookie: clientCookie } } } = client
        const { sessionId: clientSessionId } = cookieParse(clientCookie)
        if (!!socketSessionId && !!clientSessionId && socketSessionId === clientSessionId) {
          client.send(messageJSON)
        }
      })
    })
  }
  catch (error) { throw error }
}

export { signinCheckUser }
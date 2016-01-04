import { parse as querystringParse, stringify as querystringStringify } from "querystring"

function signinCheckQueryHelper (signinQuery, signinCheckQueryCallback) {
  try {
    const signinQueryCorrect = signinQuery.replace("+", "%2B")
    const signinQueryParsed = querystringParse(signinQueryCorrect)
    const signinQueryCheckParsed = {
      ...signinQueryParsed,
      "openid.mode": "check_authentication"
    }
    const signinQueryCheck = querystringStringify(signinQueryCheckParsed)
    signinCheckQueryCallback(signinQueryCheck)
  }
  catch (error) { throw error }
}

export { signinCheckQueryHelper }
import querystring from "querystring"
import httpsRequest from "./../https-request"

function getSteamId (url) {
  return url.substring(36)
}

function signinCheck (signinQueryCheck, signinCheckCallback) {
  httpsRequest.get("steamcommunity.com", `/openid/login?${signinQueryCheck}`, (result) => {
    const isValid = (/is_valid:true/).test(result)
    if (isValid) {
      const signinQueryParsed = querystring.parse(signinQueryCheck)
      const { "openid.identity": steamIdentityUrl } = signinQueryParsed
      const steamId = getSteamId(steamIdentityUrl)
      signinCheckCallback(null, steamId)
    }
    else {
      signinCheckCallback(new Error("Unknown error."))
    }
  })
}

export default signinCheck
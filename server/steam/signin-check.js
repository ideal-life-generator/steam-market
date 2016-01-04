import { parse as querystringParse } from "querystring"
import { get as requestGet } from "./../request"

function getSteamId (url) {
  return url.substring(36)
}

function signinCheckSteam (signinQueryCheck, signinCheckCallback) {
  requestGet("steamcommunity.com", `/openid/login?${signinQueryCheck}`, (result) => {
    const isValid = (/is_valid:true/).test(result)
    if (isValid) {
      const signinQueryParsed = querystringParse(signinQueryCheck)
      const { "openid.identity": steamIdentityUrl } = signinQueryParsed
      const steamId = getSteamId(steamIdentityUrl)
      signinCheckCallback(null, steamId)
    }
    else {
      signinCheckCallback(new Error("Unknown error."))
    }
  })
}

export { signinCheckSteam }
import querystring from "querystring"
import signinCheck from "./../steam/signin-check"
import getProfile from "./../steam/get-profile"
import user from "./../db/user"

function signin (session, subscribe, db) {
  subscribe("signin.check", (signinQuery, sessionId) => {
    const signinQueryCorrect = signinQuery.replace("+", "%2B")
    const signinQueryParsed = querystring.parse(signinQueryCorrect)
    const signinQueryCheckParsed = {
      ...signinQueryParsed,
      "openid.mode": "check_authentication"
    }
    const signinQueryCheck = querystring.stringify(signinQueryCheckParsed)
    signinCheck(signinQueryCheck, (err, steamId) => {
      if (err) {
        session("signin.reject")
      }
      else {
        session("signin.resolve")
        getProfile(steamId, (steamProfile) => {
          session("steam-profile.response", steamProfile)
        })
        user.exist(db, steamId, (isExist) => {
          if (isExist) {
            user.updateToken(db, steamId, (isTokenUpdated) => {
              if (isTokenUpdated) {
                user.get(db, steamId, (user) => {
                  session("user.response", user)
                })
              }
              else {

              }
            })
          }
          else {
            user.create(db, steamId, (isCreated) => {
              if (isCreated) {
                user.get(db, steamId, (user) => {
                  session("user.response", user)
                })
              }
              else {

              }
            })
          }
        })
      }
    })
  })
}

export default signin
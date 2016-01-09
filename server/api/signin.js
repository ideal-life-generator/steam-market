import querystring from "querystring"
import signinCheck from "./../steam/signin-check"
import getProfile from "./../steam/get-profile"
import user from "./../db/user"

function signin (wsSessions, db) {
  wsSessions.on("signin.check", (signinQuery, sessionId) => {
    const signinQueryCorrect = signinQuery.replace("+", "%2B")
    const signinQueryParsed = querystring.parse(signinQueryCorrect)
    const signinQueryCheckParsed = {
      ...signinQueryParsed,
      "openid.mode": "check_authentication"
    }
    const signinQueryCheck = querystring.stringify(signinQueryCheckParsed)
    signinCheck(signinQueryCheck, (err, steamId) => {
      if (err) {
        wsSessions.to(sessionId, "signin.reject")
      }
      else {
        wsSessions.to(sessionId, "signin.resolve")
        // let getProfilePromise = new Promise((resolve, reject) => {
        getProfile(steamId, (steamProfile) => {
          wsSessions.to(sessionId, "user.steam-profile.take", steamProfile)
          // resolve(steamProfile)
        })
        // })
        // let createOrGetUserPromise = new Promise((resolve, reject) => {
        user.exist(db, steamId, (isExist) => {
          if (isExist) {
            user.updateToken(db, steamId, (isTokenUpdated) => {
              if (isTokenUpdated) {
                user.get(db, steamId, (user) => {
                  wsSessions.to(sessionId, "user.take", user)
                  // resolve(user)
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
                  wsSessions.to(sessionId, "user.take", user)
                  // resolve(user)
                })
              }
              else {

              }
            })
          }
        })
        // })
        // let userPromise = Promise.all([ getProfilePromise, createOrGetUserPromise ])
        // userPromise.then(([ steamProfile, user ]) => {
        //   wsSessions.to(sessionId, "signin.resolve", steamProfile, user)
        // })
      }
    })
  })
}

export default signin
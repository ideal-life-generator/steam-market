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
        let createUserOrUpdateTokenPromise = new Promise((resolve, reject) => {
          user.exist(db, steamId, (exist) => {
            if (exist) {
              user.updateToken(db, steamId, (isTokenUpdated) => {
                if (isTokenUpdated) {
                  user.get(db, steamId, (user) => {
                    resolve(user)
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
                    resolve(user)
                  })
                }
                else {
        
                }
              })
            }
          })
        })
        let getProfilePromise = new Promise((resolve, reject) => {
          getProfile(steamId, (userSteamProfile) => {
            resolve(userSteamProfile)
          })
        })
        let userPromise = Promise.all([ createUserOrUpdateTokenPromise, getProfilePromise ])
        userPromise.then(([ userProfile, userSteamProfile ]) => {
          const user = {
            ...userProfile,
            ...userSteamProfile
          }
          wsSessions.to(sessionId, "signin.resolve", user)
        })
      }
    })
  })
}

export default signin
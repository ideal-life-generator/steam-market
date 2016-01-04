import { signinCheckQueryHelper } from "./../helpers/signin-check-query"
import { signinCheckSteam } from "./../steam/signin-check"
import { getProfileSteam } from "./../steam/get-profile"
import { exist, get, create, updateToken } from "./../db/user"

function signin (wsSessions, db) {
  wsSessions.on("signin.check", (signinQuery, sessionId) => {
    signinCheckQueryHelper(signinQuery, (signinQueryCheck) => {
      signinCheckSteam(signinQueryCheck, (err, steamId) => {
        if (err) {
          wsSessions.to(sessionId, "signin.reject")
        }
        else {
          let createUserOrUpdateTokenDBPromise = new Promise((resolve, reject) => {
            exist(db, steamId, (exist) => {
              if (exist) {
                updateToken(db, steamId, (isTokenUpdated) => {
                  if (isTokenUpdated) {
                    get(db, steamId, (user) => {
                      resolve(user)
                    })
                  }
                  else {
          
                  }
                })
              }
              else {
                create(db, steamId, (isCreated) => {
                  if (isCreated) {
                    get(db, steamId, (user) => {
                      resolve(user)
                    })
                  }
                  else {
          
                  }
                })
              }
            })
          })
          let getProfileSteamPromise = new Promise((resolve, reject) => {
            getProfileSteam(steamId, (userSteamProfile) => {
              resolve(userSteamProfile)
            })
          })
          let userPromise = Promise.all([ createUserOrUpdateTokenDBPromise, getProfileSteamPromise ])
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
  })
}

export { signin }
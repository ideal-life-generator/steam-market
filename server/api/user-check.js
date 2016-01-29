import user from "./../db/user"
import getProfile from "./../steam/get-profile"

function userCheck (wsSessions, db) {
  wsSessions.on("user.check", ({ steamId, token }, sessionId, to) => {
    user.checkToken(db, steamId, token, (exist) => {
      if (exist) {
        wsSessions.to(sessionId, "user.check")
        setTimeout(() => {
          wsSessions.to(sessionId, "user.check")
        }, 500)
        getProfile(steamId, (steamProfile) => {
          wsSessions.to(sessionId, "steam-profile.response", steamProfile)
        })
      }
    }) 
  })
}

export default userCheck
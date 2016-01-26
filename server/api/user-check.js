import user from "./../db/user"
import getProfile from "./../steam/get-profile"

function userCheck (wsSessions, db) {
  wsSessions.on("user.check", ({ steamId, token }, sessionId, to) => {
    user.checkToken(db, steamId, token, (exist) => {
      if (exist) {
        wsSessions.to(sessionId, "user.check", exist)
        setTimeout(() => {
          wsSessions.to(sessionId, "user.check", null, exist)
        }, 500)
        getProfile(steamId, (steamProfile) => {
          wsSessions.to(sessionId, "steam-profile", steamProfile)
          // wsSessions.to(sessionId, "steam-profile", null, "Is not defined")
        })
      }
    }) 
  })
}

export default userCheck
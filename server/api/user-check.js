import user from "./../db/user"
import getProfile from "./../steam/get-profile"

function userCheck (wsSessions, db) {
  wsSessions.on("user.check", ({ steamId, token }, sessionId) => {
    user.checkToken(db, steamId, token, (isExist) => {
      if (isExist) {
        wsSessions.to(sessionId, "user.check.success")
        setTimeout(() => {
          wsSessions.to(sessionId, "user.check.success")
        }, 1500)
        getProfile(steamId, (steamProfile) => {
          wsSessions.to(sessionId, "steam-profile.take", steamProfile)
        })
      }
    })
  })
}

export default userCheck
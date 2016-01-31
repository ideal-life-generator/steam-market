import user from "./../db/user"
import getProfile from "./../steam/get-profile"

function userCheck (session, subscribe, db) {
  subscribe("user.check", ({ steamId, token }) => {
    user.checkToken(db, steamId, token, (exist) => {
      if (exist) {
        getProfile(steamId, (steamProfile) => {
          session("steam-profile.response", steamProfile)
        })
      }
    }) 
  })
}

export default userCheck
import { LOGOUT } from "constants/logout"

function logout () {
  return {
    type: LOGOUT
  }
}

function clearUser () {
  const { steamId, token } = localStorage
  if (Boolean(steamId)) {
    localStorage.removeItem("steamId")
  }
  if (Boolean(token)) {
    localStorage.removeItem("token")
  }
  return (dispatch, getState) => {
    dispatch(logout())
  }
}

export { logout, clearUser }
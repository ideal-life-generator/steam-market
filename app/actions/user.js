import { REQUEST_USER, RECEIVE_USER, LOGOUT_USER } from "constants/user"

function requestUser () {
  return {
    type: REQUEST_USER
  }
}

function receiveUser (user) {
  return {
    type: RECEIVE_USER,
    user
  }
}

function storeUser (user) {
  const { steamId, token } = user
  if (Boolean(steamId) && Boolean(token)) {
    localStorage.setItem("steamId", steamId)
    localStorage.setItem("token", token)
  }
  else {
    throw new Error("User is undefined")
  }
  return (dispatch, getState) => {
    dispatch(receiveUser(user))
  }
}

export { requestUser, receiveUser, storeUser }
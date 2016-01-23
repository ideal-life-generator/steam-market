import { REQUEST_STEAM_PROFILE, RECEIVE_STEAM_PROFILE } from "constants/steam-profile"

function steamProfile (
  state = {
    isFetching: false,
    isInvalid: false
  }
, action) {
  switch (action.type) {
    case REQUEST_STEAM_PROFILE:
      return Object.assign({ }, state, {
        isFetching: true
      })
    case RECEIVE_STEAM_PROFILE:
      return Object.assign({ }, state, {
        isFetching: false,
        ...action.steamProfile
      })
    default:
      return state
  }
}

export default steamProfile
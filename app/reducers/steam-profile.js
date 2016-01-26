import { REQUEST_STEAM_PROFILE, RECEIVE_STEAM_PROFILE } from "constants/steam-profile"
import { LOGOUT } from "constants/logout"

function steamProfile (
  state = {
    isValid: false,
    isLoad: false
  }
, action) {
  switch (action.type) {
    case REQUEST_STEAM_PROFILE:
      return {
        ...state,
        isValid: false,
        isLoad: true
      }
    case RECEIVE_STEAM_PROFILE:
      return {
        ...state,
        isValid: true,
        isLoad: false,
        ...action.steamProfile
      }
    case LOGOUT:
      return {
        ...state,
        isValid: false,
        isLoad: false
      }
    default:
      return state
  }
}

export default steamProfile
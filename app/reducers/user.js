import { REQUEST_USER, RECEIVE_USER } from "constants/user"
import { LOGOUT } from "constants/logout"

function user (state = { }, action) {
  switch (action.type) {
    case REQUEST_USER:
      return {
        ...state
      }
    case RECEIVE_USER:
      return {
        ...state,
        ...action.user
      }
    case LOGOUT:
      return { }
    default:
      return state
  }
}

export default user
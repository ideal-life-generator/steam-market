import { REQUEST_USER, RECEIVE_USER } from "constants/user"

function user (
  state = {
    isFetching: false,
    isInvalid: false
  }
, action) {
  switch (action.type) {
    case REQUEST_USER:
      return Object.assign({ }, state, {
        isFetching: true
      })
    case RECEIVE_USER:
      return Object.assign({ }, state, {
        isFetching: false,
        ...action.user
      })
    default:
      return state
  }
}

export default user
import { createStore, combineReducers, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import createLogger from "redux-logger"
import user from "reducers/user"
import steamProfile from "reducers/steam-profile"

const rootReducer = combineReducers({
  user,
  steamProfile
})

const loggerMiddleware = createLogger()

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  loggerMiddleware
)(createStore)

let defaultState = {
  user: {
    isChecking: true
  },
  steamProfile: null
}

let store = createStoreWithMiddleware(rootReducer, defaultState)

export default store
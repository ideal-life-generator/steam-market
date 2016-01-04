import React from "react"
import { render } from "react-dom"
import { createStore } from "redux"
import Main from "./components/Main"
import common from "./styles/common.less"
import WsSession from "./ws-session"

// import { Router, Route, Link } from "react-router"
// import createHistory from "history/lib/createHashHistory"

// var history = createHistory({
//   queryKey: false
// })

// <Router history={history}>
//   <Route path="/" component={Main} />
// </Router>

const wsSession = new WsSession("ws://localhost:5001")

wsSession.on("signin.resolve", (user) => {
  console.log("signin.resolve", user)
  localStorage.setItem("steamId", user.steamId)
  localStorage.setItem("token", user.token)
})

const USER_SIGNED_IN = "USER_SIGNED_IN"

function signedInUser (user) {
  return {
    type: USER_SIGNED_IN,
    user
  }
}

function appReducer (state = { }, action) {
  switch (action.type) {
    case USER_SIGNED_IN:
      return {
        ...state,
        user: action.user
      }
    default:
      return state
  }
}

let appStore = createStore(appReducer)

// appStore.subscribe(() => {
//   console.log(appStore.getState())
// })

// appStore.dispatch(signedInUser({ name: "Vlad" }))

render(
  (
    <Main />
  )
  , document.getElementById("app")
)
import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import store from "store"
import Main from "./components/Main.jsx"
import common from "./styles/common.less"
import WsSession from "ws-session"

const wsSession = new WsSession("ws://localhost:5001")

// import { Router, Route, Link } from "react-router"
// import createHistory from "history/lib/createHashHistory"

// var history = createHistory({
//   queryKey: false
// })

// <Router history={history}>
//   <Route path="/" component={Main} />
// </Router>

// {
//   user: {
//     isFetching: false,
//     isInvalid: false,
//     steamId: "76561198198917703",
//     token: "7rbg80Ulkfr5x7owBX0foQ=="
//   },
//   steamProfile: {
//     isFetching: false,
//     isInvalid: false,
//     avatarId: "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg"
//     name: "Трансформер"
//   }
// }

render(
  (
    <Provider store={store}>
      <Main wsSession={wsSession} />
    </Provider>
  )
  , document.getElementById("app")
)
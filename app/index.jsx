import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import connect from "ws-session"
import { addon } from "ws-session-addon"
import store from "store"
import Main from "./containers/Main.jsx"
import common from "./styles/common.less"

render(
  (
    <Provider store={store}>
      <Main connect={connect("ws://localhost:5001")} />
    </Provider>
  )
  , document.getElementById("app")
)
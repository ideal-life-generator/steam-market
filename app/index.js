import React from "react"
import { render } from "react-dom"
import Main from "./components/Main"
import common from "./styles/common.less"
// import { Router, Route, Link } from "react-router"
import createHistory from "history/lib/createHashHistory"

// var history = createHistory({
//   queryKey: false
// })

// <Router history={history}>
//   <Route path="/" component={Main} />
// </Router>

render(
  (
    <Main />
  )
  , document.getElementById("app")
)
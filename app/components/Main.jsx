import React, { Component } from "react"
import { connect } from "react-redux"
import Header from "./Header.jsx"
import { requestUser, receiveUser, storeUser } from "actions/user"
import { requestSteamProfile, receiveSteamProfile } from "actions/steam-profile"

class Main extends Component {
  componentDidMount () {
    const { wsSession, dispatch } = this.props
    const { steamId, token } = localStorage
    if (Boolean(steamId) && Boolean(token)) {
      const userData = {
        steamId,
        token
      }
      console.log(wsSession)
      wsSession.ready(() => {
        wsSession.to("user.check", userData)
      })
      wsSession.once("user.check.success", () => {
        dispatch(receiveUser(userData))
      })
    }
    wsSession.on("user.take", (userData) => {
      dispatch(storeUser(userData))
    })
    const a1 = wsSession.on("steam-profile.take", (steamProfile) => {
      console.log("a1")
      dispatch(receiveSteamProfile(steamProfile))
    })
    // wsSession.off(a1)
    wsSession.on("steam-profile.take", (steamProfile) => {
      console.log("a2")
      dispatch(receiveSteamProfile(steamProfile))
    })
  }
  render () {
    const { steamProfile } = this.props
    return (
      <div>
        <Header steamProfile={steamProfile} />
      </div>
    )
  }
}

export default connect((state) => { return state })(Main)
import React, { Component } from "react"
import { connect } from "react-redux"
import Header from "containers/Header.jsx"
import { requestUser, receiveUser, storeUser } from "actions/user"
import { requestSteamProfile, receiveSteamProfile } from "actions/steam-profile"
import { clearUser } from "actions/logout"

class Main extends Component {
  componentDidMount () {
    const { connection: { connected, send, subscribe }, dispatch } = this.props
    const { steamId, token } = localStorage
    if (Boolean(steamId) && Boolean(token)) {
      let user = {
        steamId,
        token
      }
      connected(() => {
        send("user.check", user)
      })
      dispatch(requestSteamProfile())
    }
    subscribe("steam-profile.response", (steamProfile) => {
      dispatch(receiveSteamProfile(steamProfile))
    })
    subscribe("user.response", (user) => {
      dispatch(storeUser(user))
    })
  }
  render () {
    const { dispatch, connection: { send }, steamProfile, user: { userId } } = this.props
    return (
      <div>
        <Header
          steamProfile={steamProfile}
          logoutHandler={() => {
            send("user.logout", userId)
            dispatch(clearUser())
          }} />
      </div>
    )
  }
}

export default connect((state) => { return state })(Main)
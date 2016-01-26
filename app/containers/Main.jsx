import React, { Component } from "react"
import { connect } from "react-redux"
import Header from "containers/Header.jsx"
import { requestUser, receiveUser, storeUser } from "actions/user"
import { requestSteamProfile, receiveSteamProfile } from "actions/steam-profile"
import { clearUser } from "actions/logout"

class Main extends Component {
  componentDidMount () {
    const { connect: { connected, sendOnce, send, subscribeOnce, subscribe }, dispatch } = this.props
    const { steamId, token } = localStorage
    if (Boolean(steamId) && Boolean(token)) {
      let user = {
        steamId,
        token
      }
      connected(() => {
        sendOnce("user.check", user, () => {
          dispatch(receiveUser(user))
        })
      })
      dispatch(requestSteamProfile())
    }
    subscribe("steam-profile", (steamProfile) => {
      dispatch(receiveSteamProfile(steamProfile))
    })
    subscribe("user", (user) => {
      dispatch(storeUser(user))
    })
  }
  render () {
    const { dispatch, connect: { send }, steamProfile, user: { userId } } = this.props
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
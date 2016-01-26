import React, { Component } from "react"
import userPanel from "styles/steam-profile.less"

class SteamProfile extends Component {
  render () {
    const { steamProfile: { avatarId, name }, logoutHandler } = this.props
    return (
      <div className="steam-profile">
        <img src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${avatarId}_full.jpg`} />
        <h5>{name}</h5>
        <a
          className="logout"
          onClick={logoutHandler}>
            Logout
        </a>
      </div>
    )
  }
}

export default SteamProfile
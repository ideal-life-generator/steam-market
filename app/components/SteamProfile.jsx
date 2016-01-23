import React, { Component } from "react"

class SteamProfile extends Component {
  render () {
    const { avatarId, name } = this.props.steamProfile
    return (
      <div>
        <img src={ `https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${avatarId}_full.jpg` } />
        <h5>{ name }</h5>
      </div>
    )
  }
}

export default SteamProfile
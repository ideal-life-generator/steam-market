import React, { Component } from "react"
import SteamProfile from "components/SteamProfile.jsx"
import Login from "components/Login.jsx"
import header from "styles/header.less"

class Header extends Component {
  render () {
    const { steamProfile, logoutHandler } = this.props
    let userPanel
    if (steamProfile.isLoad) {
      userPanel = <div>load</div>
    }
    else if (steamProfile.isValid) {
      userPanel = <SteamProfile
                    steamProfile={steamProfile}
                    logoutHandler={logoutHandler} />
    }
    else {
      userPanel = <Login />
    }
    return (
      <header className="main-header">
        <aside className="user-panel">
          {userPanel}
        </aside>
      </header>
    )
  }
}

export default Header
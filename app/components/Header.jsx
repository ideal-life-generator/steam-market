import React, { Component } from "react"
import SteamProfile from "./SteamProfile.jsx"
import header from "styles/header.less"
import userPanel from "styles/user-panel.less";
import Login from "./Login.jsx";

class Header extends Component {
  render () {
    const { steamProfile } = this.props
    let UserPanel
    if (Boolean(steamProfile)) {
      UserPanel = <SteamProfile
                    steamProfile={steamProfile} />
    }
    else {
      UserPanel = <Login />
    }
    return (
      <header className="main-header">
        <span style={{
          "fontFamily": "Pacifico",
          "fontSize": "50px"
        }}>
        </span>
        <aside className="user-panel">
          {UserPanel}
        </aside>
      </header>
    )
  }
}

export default Header
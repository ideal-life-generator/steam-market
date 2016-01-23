import React, { Component } from "react"
import login from "styles/login.less"

class Login extends Component {
  render () {
    return (
      <a
        className="login"
        onClick={this.registrationPoppup}
      >
      </a>
    )
  }

  registrationPoppup () {
    const width = 990
    const height = 540
    // const left = (window.innerWidth - width) / 2 + window.screenLeft
    // const top = (window.innerHeight - height) / 2 + window.screenTop
    const right = 50 + window.screenLeft
    const top = 50 + window.screenTop
    let signinPoppup = window.open(
      `
        https://steamcommunity.com/openid/login?
        openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select&
        openid.identity=http://specs.openid.net/auth/2.0/identifier_select&
        openid.ns=http://specs.openid.net/auth/2.0&
        openid.mode=checkid_setup&
        openid.return_to=http://localhost:5000/signin&
        openid.realm=http://localhost:5000/
      `
    , null,
      `
        width=${width},
        height=${height},
        right=${right},
        top=${top}
      `
    )
    if (window.focus) {
      signinPoppup.focus()
    }
  }
}

export default Login
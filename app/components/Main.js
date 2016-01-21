import React, { Component } from "react"
import Header from "./Header"

class Main extends Component {
  render () {
    const { steamProfile } = this.props
    return (
      <div>
        <Header steamProfile={steamProfile} />
      </div>
    )
  }
}

export default Main
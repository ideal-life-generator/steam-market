import React, { Component } from "react";
import Authorization from "./Authorization";
import header from "styles/header.less";

class Header extends Component {
  render () {
    return (
      <header className="main-header">
        <span style={{
          "fontFamily": "Pacifico",
          "fontSize": "50px"
        }}>
        </span>
        <Authorization />
      </header>
    );
  }
}

export default Header;
import React, { Component } from "react";
import Login from "./Login";
import authorization from "styles/authorization.less";

class Authorization extends Component {
  render () {
    return (
      <aside className="authorization">
        <Login />
      </aside>
    );
  }
}

export default Authorization;
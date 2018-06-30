import React, { Component } from 'react';

class HeaderTimer extends Component {
  render() {
    return (
      <h2 className="display-time" ref="display-time">Pomodoro</h2>
    );
  }
}

export default HeaderTimer;
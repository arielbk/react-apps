import React, { Component } from 'react';

class HeaderTimer extends Component {
  render() {
    return (
      <h2 className="display-time" ref="display-time" style={this.props.style}>{this.props.content}</h2>
    );
  }
}

export default HeaderTimer;
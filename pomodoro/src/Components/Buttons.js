import React, { Component } from 'react';

class Buttons extends Component {
  render() {
    return (
    <div className="buttons">
      <a className="countdown" onClick={this.props.onStartPause}><i className="fas fa-play"></i> Work</a>
      <a className="reset" onClick={this.props.onReset}><i className="fas fa-sync-alt"></i> Reset</a>
    </div>
    );
  }
}

export default Buttons;
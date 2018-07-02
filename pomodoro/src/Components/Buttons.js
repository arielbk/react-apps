import React, { Component } from 'react';

class Buttons extends Component {
  render() {
    return (
    <div className="buttons">
      <a className="countdown" onClick={this.props.onPlayPause}>
        {this.props.content === 'Work' ||
          this.props.content === 'Break' ||
          this.props.content === 'Continue'
            ? <i className="fas fa-play" /> 
            : <i className="fas fa-pause" />}
        {this.props.content}
      </a>
      <a className="reset" onClick={this.props.onReset}><i className="fas fa-sync-alt"></i> Reset</a>
    </div>
    );
  }
}

export default Buttons;
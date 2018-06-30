import React, { Component } from 'react';

class ProgressBar extends Component {
  render() {
    return (
      <div className="progress-container">
          <div ref="progressBar" className="progress-bar"></div>
      </div>
    );
  }
}

export default ProgressBar;
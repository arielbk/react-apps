import React, { Component } from 'react';

function ButtonProgress(props) {
  return (
  <div className="button-progress">
    <div className="button-progress-inner">
      &nbsp;<i class="fas fa-play"></i>
    </div>
  </div>
  );
}

function ShowTime(props) {
  return (
    <div className="show-time">
      <div className="minutes">23</div>
      <div className="seconds-group">
        <div className="seconds">59</div>
        <div className="milliseconds">596</div>
      </div>
    </div>
  )
}

function Settings(props) {
  return (
    <div className="settings">
      {/* <h2>Settings</h2> */}
    </div>
  )
}

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1 className="main-header">Pomodoro Timer</h1>
        <div className="top-divider"></div>
        <div className="main-content">
          <ButtonProgress />
          <ShowTime />
        </div>
        <Settings />
      </div>
    );
  }
}

export default App;

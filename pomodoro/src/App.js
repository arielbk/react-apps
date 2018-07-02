// All state for the app lives here - passed down as props to children components

import React, { Component } from 'react';
import HeaderTimer from './Components/HeaderTimer';
import Buttons from './Components/Buttons';
import Options from './Components/Options';
import ProgressBar from './Components/ProgressBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // boolean - is the work timer currently active? else break timer is
      workTime: true,
      intervalID: 0,
      timing: false,
      timerStarted: false,

      // WORK TIMER
      work: {
        name: 'work',
        length: 1500, // 25*60 --- 25 minutes is default
        timeRemaining: 1500,
      },

      // BREAK TIMER
      break: {
        name: 'break',
        length: 300,
        timeRemaining: 300,
      },

      styles: {
        header: {
          color: 'rgb(143, 0, 0)',
        },
        progressBar: {
          width: 0,
        backgroundColor: 'rgba(143, 0, 0)',
        }
      },

      content: {
        header: 'Pomodoro',
        startPauseBtn: 'Work',
      },

    }

    // function bindings
    this.handleStartPause = this.handleStartPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSetTime = this.handleSetTime.bind(this);
  }

  timerClone(timer = 'work') { // defaults to work timer
    if (timer === 'work') {
      return {...this.state.work};
    } else {
      return {...this.state.break};
    }
  }

  handleStartPause() {

    // clone active timer and track whether working with break or work timer
    let timer;
    this.state.workTime
      ? timer = this.timerClone('work')
      : timer = this.timerClone('break');

    // if this is a fresh timer, set its remaining time to input value
    if (!timer.started) {
      timer.timeRemaining = timer.length;
    }

    // clone content to toggle UI
    const content = {...this.state.content};

    // pause or play the timer depending on current state
    if (timer.timing) { // pause the timer
      clearInterval(this.state.intervalID);
      content.startPauseBtn = 'Continue';
    } else { // run the timer and set new intervalID
      this.setState({ intervalID: setInterval(() => this.timerFunc(), 1000) });
      content.startPauseBtn = 'Pause';
    }

    // timer has now changed, toggle whether it is active or paused
    timer.started = true;
    timer.timing = !timer.timing;

    this.state.workTime 
      ? this.setState({ work: timer, content }) 
      : this.setState({ break: timer, content });
  }

  // timer function called every second while timer is on
  timerFunc() { // timer passed in is EITHER the work or break timer object

    // clone active timer and track whether working with break or work timer
    let timer;
    this.state.workTime
      ? timer = this.timerClone('work')
      : timer = this.timerClone('break');

    // content and styles to reset
    const content = {...this.state.content};
    const styles = JSON.parse(JSON.stringify(this.state.styles)); // deep clone

    // if timer ends
    if (timer.timeRemaining < 1) {
      this.handleReset();

      // UI changes -- before breaktime toggle!
      if (this.state.workTime) { // change ui to reflect work
        styles.header.color = 'rgb(143,0,0)';
        styles.progressBar.background = 'rgb(143, 0, 0)';
        content.startPauseBtn = 'Work';
      } else { // change ui to reflect break
        styles.header.color = 'rgb(0,120,0)';
        styles.progressBar.background = 'rgb(0, 120, 0)';
        content.playPauseBtn = 'Break';
      }

      // toggle whether it is breaktime and set new ui
      this.setState({ breakTime: !this.state.breakTime, styles, content })

      return; // end function
    };

    // V  TIMER IS STILL RUNNING  V

    // display current time and decrement time by 1
    const minsRemaining = 
      (Math.floor((timer.timeRemaining % (60*60)) / 60))
      // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const secsRemaining = 
      (Math.floor((timer.timeRemaining % 60)))
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

    content.header = `${minsRemaining}:${secsRemaining}`;
    styles.progressBar.width = `${500 - (timer.timeRemaining / timer.length) * 500}px`;

    timer.timeRemaining--;

    // set new states
    this.setState({ content, styles })
    this.state.workTime
      ? this.setState({ work: timer })
      : this.setState({ break: timer });
  }

// reset all state, if button is pressed then revert to work timer
  handleReset(resetButton = false) { // just reset by default

    if(resetButton) {
      this.setState({ workTimer: true });
      // more needed here, pass it to a function?
    }

    clearInterval(this.state.intervalID);

    const state = JSON.parse(JSON.stringify(this.state));

    // so that timer does not continue to run in bg
    if (state.work.timing || state.break.timing) this.startPause();

    // reset all values
    state.work.timeRemaining = state.work.length;
    state.work.started = false;
    state.work.timing = false;
    // stateClone.break.length = inputTimeBreak.value * 60;
    state.break.timeRemaining = state.break.length;
    state.break.started = false;
    state.break.timing = false;

    this.setState(state);
  }

  handleSetTime(event) {

    let timer;

    if ((event.target.ref === 'workInput' && this.state.workTime === true) ||
        (event.target.ref === 'breakInput' && this.state.workTime === false)) {
      timer = this.timerClone();
    } else {
      timer = this.timerClone(false);
    }

    timer.length = Number(event.target.value);

    if (this.state.workTime) {
      this.setState({ work: timer })
    } else {
      this.setState({ break: timer })
    }
  }

  render() {
    return (
      <div className="container">
        <div className="inner-wrapper">
          <HeaderTimer />
          <ProgressBar 
            colour={this.state.progressColour}
          />
          <Buttons 
            onStartPause={this.handleStartPause}
            onReset={this.handleReset}
            content={this.state.content.startPauseBtn}
          />
        </div>
        <Options 
          onSetTime={this.handleSetTime}
          workTime={this.state.work.length}
          breakTime={this.state.break.length}
        />
        <audio ref="bell">
          <source src="./assets/sounds/bell.wav" type="audio/wav"> 
          </source>
        </audio>
      </div>
    );
  };
}

export default App;
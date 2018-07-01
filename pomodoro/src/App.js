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
      // boolean - is the break timer currently active? else work timer is
      breakTime: false,
      intervalID: 0,
      timing: false,
      timerStarted: false,

      // WORK TIMER
      work: {
        length: 1500, // 25*60 --- 25 minutes is default
        timeRemaining: 1500,
      },

      // BREAK TIMER
      break: {
        length: 300,
        timeRemaining: 300,
      },

      styles: {
        headerColour: 'rgb(143, 0, 0)',
        progressWidth: 0,
        progressColour: 'rgba(143, 0, 0)',
      },

      content: {
        header: 'Pomodoro',
        startPauseBtn: <span><i className="fas fa-play"></i> Work</span>,
      },

    }

    // function bindings
    this.handleStartPause = this.handleStartPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSetTime = this.handleSetTime.bind(this);
  }

  handleStartPause() {

    // clone active timer and track whether working with break or work timer
    let timer;
    let timerName
    if (this.state.breakTime) {
      timer = JSON.parse(JSON.stringify(this.state.break));
      timerName = 'break';
    } else {
      timer = JSON.parse(JSON.stringify(this.state.work));
      timerName = 'work';
    }

    // if this is a fresh timer, set its remaining time to input value
    if (!timer.started) {
      timer.timeRemaining = timer.length;
    }

    // clone content to toggle UI
    const content = Array.from(this.state.content);

    // pause or play the timer depending on current state
    let intervalID;
    if (timer.timing) { // pause the timer
      clearInterval(intervalID);
      content.startPauseBtn = <span><i className="fas fa-play"></i> Continue</span>;
    } else { // run the timer
      intervalID = setInterval(() => this.timerFunc(timerName), 1000);
      content.startPauseBtn = <span><i className="fas fa-pause"></i> Pause</span>;
    }

    // timer has now changed, toggle whether it is active or paused
    timer.started = true;
    timer.timing = !timer.timing;

    this.state.breakTime 
      ? this.setState({ break: timer, intervalID, content }) 
      : this.setState({ work: timer, intervalID, content });
  }

  // timer function called every second while timer is on
  timerFunc(timer) { // timer passed in is EITHER the work or break timer object

    // clone work or break timer
    if (timer === 'work') {
      timer = JSON.parse(JSON.stringify(this.state.work));
    } else {
      timer = JSON.parse(JSON.stringify(this.state.break));
    }

    // if timer ends
    if (timer.timeRemaining < 1) {
      this.handleReset();

      // UI changes -- before breaktime toggle!
      const styles = Array.from(this.state.styles);
      const content = Array.from(this.state.content);
      if (this.state.breakTime) { // change ui to reflect work
        styles.header.color = 'rgb(143,0,0)';
        content.startPauseBtn = <span><i class="fas fa-play"></i> Work</span>;
        styles.progressColour = 'rgb(143, 0, 0)';
      } else { // change ui to reflect break
        styles.headerColour = 'rgb(0,120,0)';
        content.playPauseBtn = <span><i class="fas fa-play"></i> Break</span>;
        styles.progressColour = 'rgb(0, 120, 0)';
      }

      // toggle whether it is breaktime and set new ui
      this.setState({ breakTime: !this.state.breakTime, styles, content })

      return; // end function
    };


    // display current time and decrement time by 1
    const minsRemaining = 
      (Math.floor((timer.timeRemaining % (60*60)) / 60))
      // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    const secsRemaining = 
      (Math.floor((timer.timeRemaining % 60)))
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

    const contentClone = Array.from(this.state.content);
    const stylesClone = Array.from(this.state.styles);

    contentClone.header = `${minsRemaining}:${secsRemaining}`;
    stylesClone.progressWidth = `${500 - (timer.timeRemaining / timer.length) * 500}px`;

    timer.timeRemaining--;

    this.setState({ content: contentClone, styles: stylesClone, work: timer})
  }

  changeTimer(newTimer) {

  }

// when reset button is pushed or after time runs out
  handleReset() {

    clearInterval(this.state.intervalID);

    // progressBar.style.width = 0;

    const stateClone = JSON.parse(JSON.stringify(this.state));

    // // so that timer does not continue to run in bg
    // if (this.state.work.timing || this.state.break.timing) startPause(this.state.timerObj);

    // reset all values
    // stateClone.work.length = inputTimeWork.value * 60;
    stateClone.work.timeRemaining = stateClone.work.length;
    stateClone.work.started = false;
    stateClone.work.timing = false;
    // stateClone.break.length = inputTimeBreak.value * 60;
    stateClone.break.timeRemaining = stateClone.break.length;
    stateClone.break.started = false;
    stateClone.break.timing = false;

    this.setState(stateClone);

    // displayTime.innerText = '';
    console.log('reset');
  }

  handleSetTime(event) {

    let currentTimer;
    let breakTime;

    if (event.target.classList.value === 'input-time-work') {
      currentTimer = JSON.parse(JSON.stringify(this.state.work));
      breakTime = false;
    } else {
      currentTimer = JSON.parse(JSON.stringify(this.state.break));
      breakTime = true;
    }

    currentTimer.length = Number(event.target.value);

    if (breakTime) {
      this.setState({ break: currentTimer })
    } else {
      this.setState({ work: currentTimer })
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
import React, { Component } from 'react';
import HeaderTimer from './Components/HeaderTimer';
import Buttons from './Components/Buttons';
import Options from './Components/Options';
import ProgressBar from './Components/ProgressBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // boolean - is the break timer currently active?
      breakTime: false,
      intervalID: 0,

      // WORK TIMER
      work: {
        length: 1500, // 25*60 --- 25 minutes is default
        timeRemaining: 1500,
        timing: false, // a flag for start/pause
        started: false,
      },

      // BREAK TIMER
      break: {
        length: 300,
        timeRemaining: 300,
        timing: false, // timing controlled by start/stop
        started: false, // controls whether choosing a new time will take effect
      },

      styles: {
        headerColour: 'rgb(143, 0, 0)',
        progressWidth: 0,
        progressColour: 'rgba(143, 0, 0)',
      },

      content: {
        header: 'Pomodoro',
        startPauseButton: '<i class="fas fa-play"></i> Work',
      },

    }
    this.handleStartPause = this.handleStartPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSetTime = this.handleSetTime.bind(this);

    // this.displayTime = document.querySelector('.display-time');
    // this.progressBar = document.querySelector('.progress-bar');
    // this.bell = document.querySelector('.bell');
  }

  handleStartPause() {
    
    let timer;

    // break or work?
    this.state.breakTime 
      ? timer = JSON.parse(JSON.stringify(this.state.break))
      : timer = JSON.parse(JSON.stringify(this.state.work));

    // if this is a fresh timer, set its remaining time to input value
    if (!timer.started) {
      timer.timeRemaining = timer.length;
    }

    timer.started = true;
    timer.timing = !timer.timing; // toggle whether timing with start and pause

    const content = Array.from(this.state.content);

    let timerName;
    this.state.breakTime ? timerName = 'break' : timerName = 'work';

    // let intervalID;
    // if (!timer.timing) { // if the timer is not running before click
    //   intervalID = setInterval(() => this.timerFunc(timerName), 1000);
    //   content.startPauseButton = `<i class="fas fa-pause"></i> Pause`; // begin timer and display green pause button
    // } else {
    //   clearInterval(intervalID);
    //   content.startPauseButton = `<i class="fas fa-play"></i> Continue`; // i.e. timer is paused
    // }

    const intervalID = setInterval(() => this.timerFunc(timerName), 1000);

    this.state.breakTime ? this.setState({ break: timer }) : this.setState({ work: timer });
    this.setState({ intervalID: intervalID, content: content });
  }

// when reset button is pushed or after time runs out
  handleReset() {

    // clearInterval(intervalID);

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

// timer function called every second while timer is on
timerFunc(timer) { // timer passed in is EITHER the work or break timer object
  if (!timer.timing) {
    clearInterval(this.state.intervalID);
    return;
  }

  console.log('yo');

  if (timer === 'work') {
    timer = JSON.parse(JSON.stringify(this.state.work));
  } else {
    timer = JSON.parse(JSON.stringify(this.state.break));
  }

  // if timer ends, pass along to another function
  if (timer.timeRemaining < 1) {
    this.handleReset();
    // bell.play();
    // displayTime.innerText = 'Finished!';

    const stylesClone = Array.from(this.state.styles);

    // UI changes -- before breaktime toggle!
    if (!this.state.breakTime) {
      stylesClone.headerColour = 'rgb(0,120,0)';
      // this.startButton.innerHTML = `<i class="fas fa-play"></i> Break`;
      stylesClone.progressColour = 'rgb(0, 120, 0)';
    } else {
      this.displayTime.style.color = 'rgb(143,0,0)';
      // this.startButton.innerHTML = `<i class="fas fa-play"></i> Work`;
      stylesClone.progressColour = 'rgb(143, 0, 0)';
    }

    // toggle whether it is breaktime and set new styles
    this.setState({ breakTime: !this.state.breakTime, styles: stylesClone })

    return; // and break out of the function
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

  render() {
    return (
      <div className="container">
        <div className="inner-wrapper">
          <HeaderTimer />
          <ProgressBar />
          <Buttons 
            onStartPause={this.handleStartPause}
            onReset={this.handleReset}
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
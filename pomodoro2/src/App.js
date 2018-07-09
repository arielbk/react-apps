import React, { Component } from 'react';

  // -----------------------------------------------------------------------------------------
  //                                                                              COMPONENTS
  // -----------------------------------------------------------------------------------------

function ButtonProgress(props) {
  return (
  <div className="buttons-container">  
    <div className="close-button" onClick={props.onReset}>✕</div>
    <div 
      className="button-progress"
      onClick={props.handleClick}
    >
      <div className="button-progress-inner">
        <i className={props.faIcon} style={props.playPauseColor}></i>
      </div>
    </div>
  </div>
  );
}

function ShowTime(props) {
  return (
    <div className="show-time">
      <div className="minutes" style={props.font}>{props.time.mins}</div>
      <div className="seconds-group">
        <div className="seconds">{props.time.secs}</div>
        <div className="milliseconds">{props.time.msecs}</div>
      </div>
    </div>
  )
}

function Counters(props) {
  return (
    <div className="counters">
      <div className="counter-pomodoros">{props.pomodoros}</div>
      <div className="counter-group">
        <div className="counter-goal">of <span editable="true">{props.goal}</span></div>
        <div className="counter-text">pomodoros<br /> completed</div>
      </div>
    </div>
  )
}

function SoundSettings(props) {
  return (
    <div className="settings">
      <h2>Settings</h2>
    </div>
  )
}


  // -----------------------------------------------------------------------------------------
  //                                                                          MAIN CONSTRUCTOR
  // -----------------------------------------------------------------------------------------

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // boolean - is the work timer currently active? else break timer is active
      workTime: true,
      longBreakTime: false,
      intervalID: 0,
      timing: false,
      timerStarted: false,

      pomodoros: 0,
      goal: 9,
      pomodoroSet: 2, // number of pomodoros before a long break

      // WORK TIMER
      work: {
        name: 'work',
        length: 10, // 25*60 -- 25 minutes is default - set to 1500
        timeRemaining: 10000,
      },

      // BREAK TIMER
      break: {
        name: 'break',
        length: 5,
        timeRemaining: 5000,
      },

      // LONG BREAK TIMER
      longBreak: {
        name: 'longBreak',
        length: 15,
        timeRemaining: 15000,
      },

      styles: {
        font: {
          color: 'var(--lightred)',
        },
        playPause: {
          color: 'var(--lightgreen)',
        }
      },

      showTime: {
        mins: '25',
        secs: '00',
        msecs: '000',
      },

      playPauseIcon: 'fas fa-play',
    }

    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  // -----------------------------------------------------------------------------------------
  //                                                                              FUNCTIONS
  // -----------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  //                                           play/pause timer
  // --------------------------------------------------------------------------

  handlePlayPause() {
    // clone active timer and track whether working with break, long break or work timer
    let timer;
    if (this.state.longBreakTime) {
      timer = this.timerClone('longBreak');
    } else if (this.state.workTime) {
      timer = this.timerClone('work')     
    } else {
      timer = this.timerClone('break');
    }

    // if this is a fresh timer, set its remaining time to input value
    if (!timer.started) {
      timer.timeRemaining = timer.length;
    }

    // pause or play the timer depending on current state
    if (timer.timing) { // pause the timer
      clearInterval(this.state.intervalID);
    } else { // run the timer and set new intervalID
      this.setState({ intervalID: setInterval(() => this.timerFunc(), 1) });
    }

    // timer has now changed, toggle whether it is active or paused
    timer.started = true;
    timer.timing = !timer.timing;

    // styles to reset
    const styles = JSON.parse(JSON.stringify(this.state.styles)); // deep clone
    timer.timing
      ? styles.playPause.color = 'var(--lightred)'
      : styles.playPause.color = 'var(--lightgreen)';

    // icon to change
    let playPauseIcon = {...this.state.playPauseIcon};
    timer.timing
      ? playPauseIcon = 'fas fa-pause'
      : playPauseIcon = 'fas fa-play';

    if (this.state.longBreakTime) {
      this.setState({ longBreak: timer, styles, playPauseIcon }) 
    } else if (this.state.workTime) {
      this.setState({ work: timer, styles, playPauseIcon })     
    } else {
      this.setState({ break: timer, styles, playPauseIcon });
    }
  }

  // --------------------------------------------------------------------------
  //                                           timer function
  // --------------------------------------------------------------------------

  // timer function called every second while timer is on
  timerFunc() { // timer passed in is EITHER the work or break timer object

    // clone active timer and track whether working with break, long break or work timer
    let timer;
    if (this.state.longBreakTime) {
      timer = this.timerClone('longBreak');
    } else if (this.state.workTime) {
      timer = this.timerClone('work')     
    } else {
      timer = this.timerClone('break');
    }

    // styles to re-set
    const styles = JSON.parse(JSON.stringify(this.state.styles)); // deep clone

    // if timer ends
    if (timer.timeRemaining < 1) {
      this.handleReset();

      // UI changes -- before worktime toggle!
      if (this.state.workTime) { // change ui to reflect next break cycle
        styles.font.color = 'var(--lightgreen)';
      } else { // change ui to reflect next work cycle
        styles.font.color = 'var(--lightred)';
      }

      const playPauseIcon = 'fas fa-play';
      styles.playPause.color = 'var(--lightgreen)';

      // toggle whether it is breaktime and set new ui
      this.setState({ workTime: !this.state.workTime, styles, playPauseIcon });

      // NEXT timer
      if (((this.state.pomodoros + 1) % this.state.pomodoroSet) === 0 
            && !this.state.workTime) { // time for a long break!
        this.updateTimeShown(this.state.longBreak.timeRemaining);
        this.setState(prevState => { 
          return { longBreakTime: true, pomodoros: prevState.pomodoros + 1 } 
        });
      } else if (this.state.workTime) { // time to work!
        this.updateTimeShown(this.state.work.timeRemaining);
        this.setState({ longBreakTime: false });
      } else { // time for a short break!
        this.updateTimeShown(this.state.break.timeRemaining);
        this.setState(prevState => {
          return { pomodoros: prevState.pomodoros + 1, longBreakTime: false }
        });
      }

      return; // end function
    };

    // V  TIMER IS STILL RUNNING  V

    // immediately decrement the timer we are working with
    timer.timeRemaining--;

    this.updateTimeShown(timer.timeRemaining);

    // set new state
    if (this.state.longBreakTime) {
      this.setState({ longBreak: timer }) 
    } else if (this.state.workTime) {
      this.setState({ work: timer })     
    } else {
      this.setState({ break: timer });
    }
  }

  // --------------------------------------------------------------------------
  //                                           timer cloner
  // --------------------------------------------------------------------------

  timerClone(timer = 'work') { // defaults to work timer
    if (timer === 'work') {
      return {...this.state.work};
    } else if (timer === 'break') {
      return {...this.state.break};
    } else if (timer === 'longBreak') {
      return {...this.state.longBreak};
    }
    return;
  }

  // --------------------------------------------------------------------------
  //                                           updateTimeShown
  // --------------------------------------------------------------------------

  // this will take in seconds and return a string like 03:26
  updateTimeShown(milliseconds) {
    const mins = 
      (Math.floor((milliseconds/(1000*60*60)) % 60))
      // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    const secs = 
      (Math.floor((milliseconds/1000)%60))
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    // const milliSecondsRemaining = (milliseconds%1000)/100
    this.setState({ showTime: {
      mins,
      secs,
      msecs: '000',
    }})
  }

  // --------------------------------------------------------------------------
  //                                           handle reset
  // --------------------------------------------------------------------------

  // reset all state, if button is pressed then revert to work timer
  handleReset(resetButton = false) { // normal reset by default

    // end any running timer function
    clearInterval(this.state.intervalID);

    // if this reset is from the button, some cosmetic changes are also required...
    if (resetButton) {
      const styles = JSON.parse(JSON.stringify(this.state.styles));

      // icon to change
      const playPauseIcon = 'fas fa-play';
      
      styles.font.color = 'var(--lightred)';
      styles.playPause.color = 'var(--lightgreen)';

      this.setState({ workTime: true, styles, playPauseIcon });
    }

    const workTimer = {...this.state.work};
    const breakTimer = {...this.state.break};

    // reset all values
    workTimer.timeRemaining = workTimer.length * 1000;
    workTimer.started = false;
    workTimer.timing = false;
    // stateClone.break.length = inputTimeBreak.value * 60;
    breakTimer.timeRemaining = breakTimer.length * 1000;
    breakTimer.started = false;
    breakTimer.timing = false;

    this.updateTimeShown(workTimer.timeRemaining);

    this.setState({ work: workTimer, break: breakTimer });
  }

  // -----------------------------------------------------------------------------------------
  //                                                                              MAIN RENDER
  // -----------------------------------------------------------------------------------------


  render() {
    return (
      <div className="app">
        <h1 className="main-header">Pomodoro Timer</h1>
        <div className="top-divider"></div>
        <div className="main-content">
          <ButtonProgress 
            playPauseColor={this.state.styles.playPause} 
            handleClick={this.handlePlayPause}
            faIcon={this.state.playPauseIcon}
            onReset={() => this.handleReset(true)}
          />
          <ShowTime
            font={this.state.styles.font}
            time={this.state.showTime}
          />
          <Counters 
            pomodoros={this.state.pomodoros}
            goal={this.state.goal}
          />
        </div>
        <SoundSettings />
      </div>
    );
  }
}

export default App;

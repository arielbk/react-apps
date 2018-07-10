// still need to add timing of milliseconds -- efficiently! also make progress circle smoother
// add settings section with custom sliders for time and different sounds
// sounds
// responsiveness for smaller screens and mobile-specific features

import React, { Component } from 'react';

  // -----------------------------------------------------------------------------------------
  //                                                                              COMPONENTS
  // -----------------------------------------------------------------------------------------

class ButtonProgress extends Component {
  constructor(props) {
    super(props);
    
    this.progressCircle = this.progressCircle.bind(this);
  }

  componentDidMount() {
    this.circle = this.refs.circle.getContext('2d');

    this.startPoint = 4.72;

    this.cw = this.circle.canvas.width;
    this.ch = this.circle.canvas.height;

    requestAnimationFrame(this.progressCircle);
  }

  componentDidUpdate(){
    requestAnimationFrame(this.progressCircle);
  }

  progressCircle() {

    let endPoint = ((this.props.progressPercent/100) * Math.PI * 2);

    this.circle.clearRect(0,0,this.cw,this.ch); // clear canvas every time function is called

    this.circle.lineWidth = 22; // stroke size
    this.props.workTime ? this.circle.strokeStyle = '#cf4547' : this.circle.strokeStyle = '#8df37a';

    this.circle.beginPath();
    this.circle.arc(76,76,65,this.startPoint,endPoint+this.startPoint); // x, y, radius, start, end

    this.circle.stroke(); // fill stroke
  }

  render() {
      return (
    <div className="buttons-container">  
      <div className="close-button" onClick={this.props.onReset}>✕</div>
      <div 
        className="button-progress"
        onClick={this.props.handleClick}
        style={this.props.backgroundColor}
      >
        <div className="button-progress-inner" style={this.props.fontColor}>
          <i className={this.props.faIcon} style={this.props.playPauseColor}></i>
        </div>
      </div>
      <canvas height="152" width="152" ref="circle" className="progress-canvas" onClick={this.props.handleClick} />
    </div>
    );
  }
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

function TimerTitles(props) {
  return (
    <div className="timer-titles">
      <div className="timer-title work-title" style={props.titleStyles.workTitle}><i className="fas fa-cog" /><span>Work</span></div>
      <div className="timer-title break-title" style={props.titleStyles.breakTitle}><i className="fas fa-cog" /><span>Break</span></div>
      <div className="timer-title break-title" style={props.titleStyles.longBreakTitle}><i className="fas fa-cog" /><span>Long Break</span></div>
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

      progressPercent: 0,

      pomodoros: 0,
      goal: 9,
      pomodoroSet: 2, // number of pomodoros before a long break

      // WORK TIMER
      work: {
        name: 'work',
        duration: 10, // 25*60 -- 25 minutes is default - set to 1500
        timeRemaining: 10,
      },

      // BREAK TIMER
      break: {
        name: 'break',
        duration: 5,
        timeRemaining: 5,
      },

      // LONG BREAK TIMER
      longBreak: {
        name: 'longBreak',
        duration: 15,
        timeRemaining: 15,
      },

      styles: {
        font: {
          color: 'var(--lightred)',
        },
        background: {
          background: 'var(--darkred)',
        },
        titles: {
          workTitle: {
            color: 'var(--lightred)',
            borderBottom: '6px solid var(--darkred)',
          },
          breakTitle: {
            color: '',
            borderBottom: '',
          },
          longBreakTitle: {
            color: '',
            borderBottom: '',
          }
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
  //                                                                      LIFE CYCLE EVENTS
  // -----------------------------------------------------------------------------------------

  // componentDidMount() {
  //   this.progressCircle();
  // }

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
      timer.timeRemaining = timer.duration;
    }

    // pause or play the timer depending on current state
    if (timer.timing) { // pause the timer
      clearInterval(this.state.intervalID);
    } else { // run the timer and set new intervalID
      this.setState({ intervalID: setInterval(() => this.timerFunc(), 1000) });
    }

    // timer has now changed, toggle whether it is active or paused
    timer.started = true;
    timer.timing = !timer.timing;

    // // styles to reset
    // const styles = JSON.parse(JSON.stringify(this.state.styles)); // deep clone
    // timer.timing
    //   ? styles.playPause.color = 'var(--lightred)'
    //   : styles.playPause.color = 'var(--lightgreen)';

    // icon to change
    let playPauseIcon = {...this.state.playPauseIcon};
    timer.timing
      ? playPauseIcon = 'fas fa-pause'
      : playPauseIcon = 'fas fa-play';

    if (this.state.longBreakTime) {
      this.setState({ longBreak: timer, playPauseIcon }) 
    } else if (this.state.workTime) {
      this.setState({ work: timer, playPauseIcon })     
    } else {
      this.setState({ break: timer, playPauseIcon });
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
      // must be a better way than all this repetition...
      if (this.state.workTime &&
          ((this.state.pomodoros + 1) % this.state.pomodoroSet) === 0 ) {
        styles.titles.workTitle.color = '';
        styles.titles.workTitle.borderBottom = '';
        styles.titles.breakTitle.color = '';
        styles.titles.breakTitle.borderBottom = '';
        styles.titles.longBreakTitle.color = 'var(--lightgreen)';
        styles.titles.longBreakTitle.borderBottom = '6px solid var(--darkgreen)';
        
        styles.font.color = 'var(--lightgreen)';
        styles.background.background = 'var(--darkgreen)';
      } else if (this.state.workTime) { // change ui to reflect next break cycle
        styles.titles.workTitle.color = '';
        styles.titles.workTitle.borderBottom = '';
        styles.titles.breakTitle.color = 'var(--lightgreen)';
        styles.titles.breakTitle.borderBottom = '6px solid var(--darkgreen)';
        styles.titles.longBreakTitle.color = '';
        styles.titles.longBreakTitle.borderBottom = '';
        
        styles.font.color = 'var(--lightgreen)';
        styles.background.background = 'var(--darkgreen)';
      } else { // change ui to reflect next work cycle
        styles.titles.workTitle.color = 'var(--lightred)';
        styles.titles.workTitle.borderBottom = '6px solid var(--darkred)';
        styles.titles.breakTitle.color = '';
        styles.titles.breakTitle.borderBottom = '';
        styles.titles.longBreakTitle.color = '';
        styles.titles.longBreakTitle.borderBottom = '';
        
        styles.font.color = 'var(--lightred)';
        styles.background.background = 'var(--darkred)';
      }

      const playPauseIcon = 'fas fa-play';
      // styles.playPause.color = 'var(--lightgreen)';

      // toggle whether it is breaktime and set new ui
      this.setState({ workTime: !this.state.workTime, styles, playPauseIcon });

      // NEXT timer
      if (((this.state.pomodoros + 1) % this.state.pomodoroSet) === 0 
            && !this.state.workTime) { // time for a long break!
        this.updateTimeShown(this.state.longBreak.timeRemaining);
        this.setState(prevState => { 
          return { longBreakTime: true, pomodoros: prevState.pomodoros + 1, progressPercent: 0 } 
        });
      } else if (this.state.workTime) { // time to work!
        this.updateTimeShown(this.state.work.timeRemaining);
        this.setState({ longBreakTime: false, progressPercent: 0 });
      } else { // time for a short break!
        this.updateTimeShown(this.state.break.timeRemaining);
        this.setState(prevState => {
          return { pomodoros: prevState.pomodoros + 1, longBreakTime: false, progressPercent: 0 }
        });
      }

      return; // end function
    };

    // V  TIMER IS STILL RUNNING  V

    // immediately decrement the timer we are working with
    timer.timeRemaining--;

    this.updateTimeShown(timer.timeRemaining);

    // TODO: this will cause problems when the timer duration is changed during an interval
    const progressPercent = Number.parseFloat((timer.duration - timer.timeRemaining) / timer.duration * 100 ).toFixed(2);

    // set new state
    if (this.state.longBreakTime) {
      this.setState({ longBreak: timer, progressPercent }) 
    } else if (this.state.workTime) {
      this.setState({ work: timer, progressPercent })     
    } else {
      this.setState({ break: timer, progressPercent });
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
  updateTimeShown(duration) { // in seconds (for now)
    const mins = 
      (Math.floor((duration/60) % 60))
      // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    const secs = 
      (Math.floor(duration%60))
      .toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
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

      styles.titles.workTitle.color = 'var(--lightred)';
      styles.titles.workTitle.borderBottom = '6px solid var(--darkred)';
      styles.titles.breakTitle.color = '';
      styles.titles.breakTitle.borderBottom = '';
      styles.titles.longBreakTitle.color = '';
      styles.titles.longBreakTitle.borderBottom = '';

      // icon to change
      const playPauseIcon = 'fas fa-play';
      
      styles.font.color = 'var(--lightred)';
      // styles.playPause.color = 'var(--lightgreen)';
      styles.background.background = 'var(--darkred)'

      this.setState({ workTime: true, styles, playPauseIcon });
    }

    const workTimer = {...this.state.work};
    const breakTimer = {...this.state.break};
    const longBreakTimer = {...this.state.longBreak};
    

    // reset all values
    workTimer.timeRemaining = workTimer.duration;
    workTimer.started = false;
    workTimer.timing = false;

    breakTimer.timeRemaining = breakTimer.duration;
    breakTimer.started = false;
    breakTimer.timing = false;
    
    longBreakTimer.timeRemaining = longBreakTimer.duration;
    longBreakTimer.started = false;
    longBreakTimer.timing = false;

    this.updateTimeShown(workTimer.timeRemaining);

    this.setState({ work: workTimer, break: breakTimer, longBreak: longBreakTimer, longBreakTime: false, progressPercent: 0, });
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
            progressPercent={this.state.progressPercent}
            workTime={this.state.workTime}
            fontColor={this.state.styles.font}
            backgroundColor={this.state.styles.background}
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
        <TimerTitles
          titleStyles={this.state.styles.titles}
        />
        {/* <audio src="bell.mp3" controls /> */}
      </div>
    );
  }
}

export default App;

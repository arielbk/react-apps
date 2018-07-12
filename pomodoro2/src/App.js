// still need to add timing of milliseconds -- efficiently! also make progress circle smoother
// add settings section with custom sliders for time and different sounds
// sounds
// responsiveness for smaller screens and mobile-specific features

import React, { Component } from 'react';
// import Sound from 'react-sound';
// import Bell from './bell.wav';
// import Jingle from './jingle.mp3';
import gentleReminder from './gentleReminder.mp3';

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
    if (this.props.workTime) {
      this.circle.strokeStyle = '#cf4547';
    } else if (!this.props.WorkTime && this.props.longBreakTime) {
      this.circle.strokeStyle = '#8df37a';
    } else {
      this.circle.strokeStyle = '#cace58';
    }

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

function TimerSettings(props) {
  return (
    <div className="timer-settings">
      <div className="settings-group settings-work">
        <div className="timer-title work-title" style={props.titleStyles.workTitle}>Work</div>
        <TimeSetter className='settings-timer-work' timer={props.work}
          onDurationChange={(timer, change) => props.onDurationChange(timer,change)}
        />
        <GoalSetter goal={props.goal} onGoalChange={change => props.onGoalChange(change)} />
      </div>
      
      <div className="settings-group settings-break">
        <div className="timer-title break-title" style={props.titleStyles.breakTitle}>Break</div>
        <TimeSetter classname='settings-timer-break' timer={props.break} 
          onDurationChange={(timer, change) => props.onDurationChange(timer,change)}
        />
      </div>

      <div className="settings-group settings-long-break">
        <div className="timer-title long-break-title" style={props.titleStyles.longBreakTitle}>Long Break</div>
        <TimeSetter classname='settings-timer-long-break' timer={props.longBreak} 
          onDurationChange={(timer, change) => props.onDurationChange(timer,change)}
        />
        <LongBreakSetter
          pomodoroSet={props.pomodoroSet}
          onSetChange={change => props.handleSetChange(change)}
        />
      </div>

        
        
    </div>
  )
}

class TimeSetter extends Component {
  render() {
    let timerName;
    this.props.timer.name === 'longBreak'
      ? timerName = 'long-break'
      : timerName = this.props.timer.name;
    return (
      <div className={`settings-timer-${timerName}`} >
        <a className='decrement' onClick={() => this.props.onDurationChange(this.props.timer.name, -1)}>–</a>
        <div className='settings-timer-show'>{Math.floor(this.props.timer.duration / 60)} min</div>
        <a className='increment' onClick={() => this.props.onDurationChange(this.props.timer.name, +1 )}>+</a>
      </div>
    );
  }
}

function GoalSetter(props) {
  return (
    <div className={`settings-goal`} >
        <a className='decrement' onClick={() => props.onGoalChange(-1)}>–</a>
        <div className='settings-goal-show'>Goal : {props.goal}</div>
        <a className='increment' onClick={() => props.onGoalChange(+1)}>+</a>
      </div>
  )
}

function LongBreakSetter(props) {
  return (
    <div className={`settings-lb-set`} >
        <a className='decrement' onClick={() => props.onSetChange(-1)}>–</a>
        <div className='settings-goal-show'>Every {props.pomodoroSet}</div>
        <a className='increment' onClick={() => props.onSetChange(+1)}>+</a>
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
      goal: 8,
      pomodoroSet: 2, // number of pomodoros before a long break

      // WORK TIMER
      work: {
        name: 'work',
        duration: 1500, // 25*60 -- 25 minutes is default - set to 1500
        timeRemaining: 1500,
      },

      // BREAK TIMER
      break: {
        name: 'break',
        duration: 300,
        timeRemaining: 300,
      },

      // LONG BREAK TIMER
      longBreak: {
        name: 'longBreak',
        duration: 900,
        timeRemaining: 900,
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
            borderBottom: '6px solid var(--lightred)',
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
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.handleSetChange = this.handleSetChange.bind(this);
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
  //                                           change sets to long break
  // --------------------------------------------------------------------------

  handleSetChange(change) {
    const pomodoroSet = this.state.pomodoroSet + change;
    if (pomodoroSet > 0) this.setState({ pomodoroSet })
  }

  // --------------------------------------------------------------------------
  //                                           change pomodoro goal
  // --------------------------------------------------------------------------

  handleGoalChange(change) {
    const goal = this.state.goal + change;
    if (goal > 0) this.setState({goal});
  }

  // --------------------------------------------------------------------------
  //                                           increment / decrement timer
  // --------------------------------------------------------------------------

  handleDurationChange(timer, change) {
    if (timer === 'work') {
      const work = this.timerClone('work');
      work.duration = work.duration + change * 60;
      if (work.duration > 0) {
        if (this.state.workTime && work.timing) work.timeRemaining = work.timeRemaining + change * 60;
        this.setState({ work });
        if (this.state.workTime && !work.timing) this.updateTimeShown(work.duration);
      }
    } else if (timer === 'break') {
      const breakTimer = this.timerClone('break');
      breakTimer.duration = breakTimer.duration + change * 60;
      if (breakTimer.duration > 0) {
        if (!this.state.workTime && !this.state.longBreakTime && breakTimer.timing) breakTimer.timeRemaining = breakTimer.timeRemaining + change * 60;
        this.setState({ break: breakTimer });
        if (!this.state.workTime && !this.state.longBreakTime && !breakTimer.timing) this.updateTimeShown(breakTimer.duration);
      }
    } else if (timer === 'longBreak') {
      const longBreak = this.timerClone('longBreak');
      longBreak.duration = longBreak.duration + change * 60;
      if (longBreak.duration > 0) {
        if (this.state.longBreakTime && longBreak.timing) longBreak.timeRemaining = longBreak.timeRemaining + change * 60;
        this.setState({ longBreak });
        if (this.state.longBreakTime && !longBreak.timing) this.updateTimeShown(longBreak.duration);
      }
    } else {
      return;
    }

  }

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

      this.refs.bell.play();

      // UI changes -- before worktime toggle!
      // must be a better way than all this repetition...
      if (this.state.workTime &&
          ((this.state.pomodoros + 1) % this.state.pomodoroSet) === 0 ) {
        styles.titles.workTitle.color = '';
        styles.titles.workTitle.borderBottom = '';
        styles.titles.breakTitle.color = '';
        styles.titles.breakTitle.borderBottom = '';
        styles.titles.longBreakTitle.color = 'var(--lightgreen)';
        styles.titles.longBreakTitle.borderBottom = '6px solid var(--lightgreen)';
        
        styles.font.color = 'var(--lightgreen)';
        styles.background.background = 'var(--darkgreen)';
      } else if (this.state.workTime) { // change ui to reflect next break cycle
        styles.titles.workTitle.color = '';
        styles.titles.workTitle.borderBottom = '';
        styles.titles.breakTitle.color = 'var(--lightyellow)';
        styles.titles.breakTitle.borderBottom = '6px solid var(--lightyellow)';
        styles.titles.longBreakTitle.color = '';
        styles.titles.longBreakTitle.borderBottom = '';
        
        styles.font.color = 'var(--lightyellow)';
        styles.background.background = 'var(--darkyellow)';
      } else { // change ui to reflect next work cycle
        styles.titles.workTitle.color = 'var(--lightred)';
        styles.titles.workTitle.borderBottom = '6px solid var(--lightred)';
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
      styles.titles.workTitle.borderBottom = '6px solid var(--lightred)';
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
            longBreakTime={this.state.longBreakTime}
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
        <TimerSettings
          titleStyles={this.state.styles.titles}
          work={this.state.work}
          break={this.state.break}
          longBreak={this.state.longBreak}
          onDurationChange={(timer, change) => this.handleDurationChange(timer, change)}
          onGoalChange={change => this.handleGoalChange(change)}
          goal={this.state.goal}
          pomodoroSet={this.state.pomodoroSet}
          handleSetChange={this.handleSetChange}
        />
        {/* <Sound 
          url={Bell}
          playStatus={Sound.status.PLAYING}
        /> */}
        <audio src={gentleReminder} ref="bell" />
      </div>
    );
  }
}

export default App;

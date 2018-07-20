// TODO: clean design for settings
// responsiveness for smaller screens and mobile-specific features
// timer can be made more efficient and milliseconds added
// make function to change styles to reflect an active timer
// refactor CSS
// local storage for user settings
// access icons locally? Font awesome adds to load time but users may have it cached...
// also - google fonts to local
// allow for multiple sounds at once (the next will not currently play when sampling)

import React, { Component } from 'react';

  // -----------------------------------------------------------------------------------------
  //                                                                              SOUNDS
  // -----------------------------------------------------------------------------------------


import Bell from './Sounds/bell.mp3';
import Triumph from './Sounds/triumph.mp3';
import LevelUp from './Sounds/levelup.mp3';
import Winning from './Sounds/winning.mp3';

  // -----------------------------------------------------------------------------------------
  //                                                                              COMPONENTS
  // -----------------------------------------------------------------------------------------

// play/pause button and circular progress bar component
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
      this.circle.strokeStyle = '#d1802a';
    }

    this.circle.beginPath();
    this.circle.arc(76,76,65,this.startPoint,endPoint+this.startPoint); // x, y, radius, start, end

    this.circle.stroke(); // fill stroke
  }

  render() {
      return (
    <div className="buttons-container">  
      <div className="reset-button" onClick={this.props.onReset}>✕</div>
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

// displays the timer's current time formatted
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

// displays pomodoros completed and pomodoro goal
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

// container and title for timers' settings component
function TimerSettings(props) {
  return (
    <div className="timer-settings" onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>

      <div className="settings-group settings-work">
        <div className="timer-title work-title" style={props.titleStyles.workTitle}>Work</div>
        <div className="timer-settings-content" style={props.settingsStyle}>
          <TimeSetter className='settings-timer-work' timer={props.work}
            onDurationChange={(timer, change) => props.onDurationChange(timer,change)}
          />
          <SoundSelector onSampleSound={timer => props.onSampleSound(timer)} activeSound={props.workSound} timer={props.work} onSoundSelect={(timer, sound) => props.onSoundSelect('work', sound)} sounds={props.sounds}/>
          <GoalSetter goal={props.goal} onGoalChange={change => props.onGoalChange(change)} />
        </div>
      </div>
      
      <div className="settings-group settings-break">
        <div className="timer-title break-title" style={props.titleStyles.breakTitle}>Break</div>
        <div className="timer-settings-content" style={props.settingsStyle}>
          <TimeSetter classname='settings-timer-break' timer={props.break} 
            onDurationChange={(timer, change) => props.onDurationChange(timer,change)}
          />
          <SoundSelector onSampleSound={timer => props.onSampleSound(timer)} activeSound={props.breakSound} timer={props.break} onSoundSelect={(timer, sound) => props.onSoundSelect('break', sound)} sounds={props.sounds}/>
        </div>
      </div>

      <div className="settings-group settings-long-break">
        <div className="timer-title long-break-title" style={props.titleStyles.longBreakTitle}>Long Break</div>
        <div className="timer-settings-content" style={props.settingsStyle}>
          <TimeSetter classname='settings-timer-long-break' timer={props.longBreak} 
            onDurationChange={(timer, change) => props.onDurationChange(timer,change)}
          />
          <SoundSelector onSampleSound={timer => props.onSampleSound(timer)} activeSound={props.longBreakSound} timer={props.longBreak} onSoundSelect={(timer, sound) => props.onSoundSelect('longBreak', sound)} sounds={props.sounds}/>
          <LongBreakSetter
            pomodoroSet={props.pomodoroSet}
            onSetChange={change => props.handleSetChange(change)}
            stopSetChange={props.stopSetChange}
          />
        </div>
      </div> 


    </div>
  )
}

// settings component - set a time
class TimeSetter extends Component {
  render() {
    let timerName;
    this.props.timer.name === 'longBreak'
      ? timerName = 'long-break'
      : timerName = this.props.timer.name;
    return (
      <div className={`settings-item settings-timer-${timerName}`} >
        <a className='decrement noselect' onMouseDown={() => this.props.onDurationChange(this.props.timer.name, -1)}>–</a>
        <div className='settings-timer-show'>{Math.floor(this.props.timer.duration / 60)} min</div>
        <a className='increment noselect' onMouseDown={() => this.props.onDurationChange(this.props.timer.name, +1 )}>+</a>
      </div>
    );
  }
}

//  settings component - select a sound
function SoundSelector(props) {

  return (
    <div className={`settings-item settings-sound settings-sound-${props.timer.name}`} >
      <a className='sound-prev-arrow noselect' onMouseDown={() => {
        let newIndex = props.sounds.indexOf(props.activeSound);

        if (newIndex < 1 ) { newIndex = props.sounds.length-1; }
        else { newIndex-- }

        props.onSoundSelect(props.timer.name, props.sounds[newIndex]);
      }}>◀</a>
        <ul className='sound-list'>
          {props.sounds.map(sound => {
            return <li key={`sound-${props.timer.name}-${sound}`} className={sound === props.activeSound ? 'sound-active' : 'sound-hidden'}><span className='sound-icon' onClick={() => props.onSampleSound(props.timer.name)}><i className="fas fa-volume-up"></i></span> {sound}</li>
          })}
        </ul>
      <a className='sound-next-arrow noselect' onMouseDown={() => {
        let newIndex = props.sounds.indexOf(props.activeSound);

        if (newIndex === props.sounds.length - 1 ) { newIndex = 0; }
        else { newIndex++ }

        props.onSoundSelect(props.timer.name, props.sounds[newIndex]);
      }}>►</a>
      <div className='sound-progress'>
        {props.sounds.map((sound, index) => {
          return <div onClick={() => props.onSoundSelect(props.timer.name, props.sounds[index])} key={`sound-tab-${props.timer.name}-${sound}`} className={sound === props.activeSound ? 'sound-progress-tab sound-progress-tab-active' : 'sound-progress-tab'}></div>
        })}
      </div>
    </div>
  )
}

// settings component - set a pomodoro goal
function GoalSetter(props) {
  return (
    <div className='settings-item settings-goal'>
        <a className='decrement noselect' onMouseDown={() => props.onGoalChange(-1)}>–</a>
        <div className='settings-goal-show'>Goal : {props.goal}</div>
        <a className='increment noselect' onMouseDown={() => props.onGoalChange(+1)}>+</a>
      </div>
  )
}

// settings component - set the number of pomodoros until a long break
function LongBreakSetter(props) {
  return (
    <div className='settings-item settings-lb-set' >
        <a className='decrement noselect' onMouseDown={() => props.onSetChange(-1)} onMouseUp={props.stopSetChange}>–</a>
        <div className='settings-goal-show'>Every {props.pomodoroSet}</div>
        <a className='increment noselect' onMouseDown={() => props.onSetChange(+1)} onMouseUp={props.stopSetChange}>+</a>
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
      // these two booleans will determine whether it is work, break, or longBreak time
      // but should they just be simplified into one?
      workTime: true,
      longBreakTime: false,

      showSettings: false,

      // the interval for the timer function (in order to stop it)
      intervalID: 0,
      // whether the active timer is currently running, and whether it has started (it can be started but paused)
      timing: false,
      timerStarted: false,

      // helps with the settings incrementors and decrementors that fire while the mouse is down
      mouseDown: false,

      // current percentage of time elapsed in active timer - to display for the progress bar
      progressPercent: 0,

      // pomodoros completed, pomodoro goal, pomodoros between each long break
      pomodoros: 0,
      goal: 8,
      pomodoroSet: 4,

      // sound names to assign to a timer
      sounds: [
        'Bell',
        'Triumph',
        'LevelUp',
        'Winning',
      ],

      // WORK TIMER
      work: {
        name: 'work',
        duration: 1500, // 25*60 -- 25 minutes is default
        timeRemaining: 1500,
        sound: 'Triumph',
      },

      // BREAK TIMER
      break: {
        name: 'break',
        duration: 300, // 5 minutes default
        timeRemaining: 300,
        sound: 'Bell',
      },

      // LONG BREAK TIMER
      longBreak: {
        name: 'longBreak',
        duration: 900, // 15 minutes default
        timeRemaining: 900,
        sound: 'Winning'
      },

      styles: {
        // for the play and pause inner icon and the minutes remaining display
        font: {
          color: 'var(--lightred)',
        },
        // used for the progress bar background
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
        },
        settings: {
          maxHeight: 0,
        },
        about: {
          maxHeight: 0,
          margin: 0,
          padding: '0 2em',
        }
      },

      // time remaining to display - default work 25 min
      showTime: {
        mins: '25',
        secs: '00',
        msecs: '000',
      },

      playPauseIcon: 'fas fa-play',
    }

  // -----------------------------------------------------------------------------------------
  //                                                                        `this` BINDINGS
  // -----------------------------------------------------------------------------------------
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleDurationChange = this.handleDurationChange.bind(this);
    this.handleGoalChange = this.handleGoalChange.bind(this);
    this.handleSetChange = this.handleSetChange.bind(this);
    this.handleSoundSelect = this.handleSoundSelect.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleAboutToggle = this.handleAboutToggle.bind(this);

    this.setMouseDown = this.setMouseDown.bind(this);
    this.setMouseUp = this.setMouseUp.bind(this);

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // -----------------------------------------------------------------------------------------
  //                                                                      LIFE CYCLE EVENTS
  // -----------------------------------------------------------------------------------------
  setMouseDown() {
    this.setState({mouseDown:true});
  }
  setMouseUp() {
    this.setState({mouseDown:false});
  }

  handleKeyPress(e) {
    if (e.key === ' ') {
      this.handlePlayPause();
    } else if (e.key === 'Escape') {
      this.handleReset(true);
    }
  }

  // keep track of mouse down and mouse up, and any key press
  componentDidMount() {
    document.addEventListener('mousedown', this.setMouseDown);
    document.addEventListener('mouseup', this.setMouseUp);
    document.addEventListener('keyup', this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.setMouseDown);
    document.removeEventListener('mouseup', this.setMouseUp);
    document.addEventListener('keyup', this.handleKeyPress);
  }

  // -----------------------------------------------------------------------------------------
  //                                                                              FUNCTIONS
  // -----------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  //                                           handle sound select
  // --------------------------------------------------------------------------

  handleSoundSelect(timer,sound) {

    // clone timer
    timer = this.timerClone(timer);
    timer.sound = sound;
    
    if (timer.name === 'work') {
      this.setState({ work: timer });
    } else if (timer.name === 'break') {
      this.setState({ break: timer });
    } else if (timer.name === 'longBreak') {
      this.setState ({ longBreak: timer });
    }
  }

  // --------------------------------------------------------------------------
  //                                     change # of sets until long break
  // --------------------------------------------------------------------------


  handleSetChange(change) {
    const pomodoroSet = this.state.pomodoroSet + change;
    if (pomodoroSet < 1) return;
    this.setState({ pomodoroSet });

    // continue recursing the function every 0.1 seconds if mouse click is held
    setTimeout(() => {
      if (this.state.mouseDown) this.handleSetChange(change);
    }, 100);
  }

  // --------------------------------------------------------------------------
  //                                           change pomodoro goal
  // --------------------------------------------------------------------------

  handleGoalChange(change) {
    const goal = this.state.goal + change;
    if (goal < 1) return;
    this.setState({goal});

    // continue recursing the function every 0.1 seconds if mouse click is held
    setTimeout(() => {
      if (this.state.mouseDown) this.handleGoalChange(change);
    }, 100);
  }

  // --------------------------------------------------------------------------
  //                                           increment / decrement timer
  // --------------------------------------------------------------------------

  handleDurationChange(timer, change) {

    // clone timer and return if new duration is inappropriate
    timer = this.timerClone(timer);
    timer.duration = timer.duration + change * 60;
    if (timer.duration < 0 || timer.duration > 5940) return; // 0 < timer < 99 minutes

    // to determine whether changes are being made to the active timer
    const workActive = timer.name === 'work' && this.state.workTime;
    const breakActive = timer.name === 'break' && !this.state.workTime && !this.state.longBreakTime;
    const longBreakActive = timer.name === 'longBreak' && this.state.longBreakTime;

    // time is added to active running timers to adjust
    if (timer.timing) {
      if (workActive) {
        timer.timeRemaining += change * 60;
      }
      if (breakActive) {
        timer.timeRemaining += change * 60;
      }
      if (longBreakActive) {
        timer.timeRemaining += change * 60;
      }
    } else { // i.e. if the activetimer is not running, the time display just updates
      if (workActive || breakActive || longBreakActive) {
        this.updateTimeShown(timer.duration);
      }
    }

    // set state
    if (timer.name === 'work') this.setState({ work: timer })
    if (timer.name === 'break') this.setState({ break: timer })
    if (timer.name === 'longBreak') this.setState({ longBreak: timer })

    // recurse the function if mouse click is held
    setTimeout(() => {
      // although this forces a new timer everytime the function is run
      if (this.state.mouseDown) this.handleDurationChange(timer.name, change);
    }, 100);

  }

  // --------------------------------------------------------------------------
  //                                           play/pause timer
  // --------------------------------------------------------------------------

  handlePlayPause() {
    // clone active timer
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
  timerFunc() {

    // clone active timer
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
      if (this.state.workTime &&
          ((this.state.pomodoros + 1) % this.state.pomodoroSet) === 0 ) 
                        this.setState({ longBreakTime: true });
      this.setState({ workTime: !this.state.workTime })

      // play the appropriate sound for the timer
      if (timer.name === 'work') {
        this.refs[this.state.work.sound].play();
      } else if (timer.name === 'break') {
        this.refs[this.state.break.sound].play();
      } else if (timer.name === 'longBreak') {
        this.refs[this.state.longBreak.sound].play();
      }

      // empty out titles styles
      styles.titles = {
        workTitle: { color: '', borderBottom: '' },
        breakTitle: { color: '', borderBottom: '' },
        longBreakTitle: { color: '', borderBottom: '' }
      }

      if (this.state.longBreakTime ) { // reflect long break cycle
        styles.titles.longBreakTitle.color = 'var(--lightgreen)';
        styles.titles.longBreakTitle.borderBottom = '6px solid var(--lightgreen)';
        styles.font.color = 'var(--lightgreen)';
        styles.background.background = 'var(--darkgreen)';

        this.updateTimeShown(this.state.longBreak.timeRemaining);
        this.setState(prevState => { 
          return { pomodoros: prevState.pomodoros + 1, progressPercent: 0 } 
        });
      } else if (this.state.workTime) { // reflect next work cycle
        styles.titles.workTitle.color = 'var(--lightred)';
        styles.titles.workTitle.borderBottom = '6px solid var(--lightred)';

        styles.font.color = 'var(--lightred)';
        styles.background.background = 'var(--darkred)';

        this.updateTimeShown(this.state.work.timeRemaining);
        this.setState({ longBreakTime: false });
      } else { // reflect next break cycle
        styles.titles.breakTitle.color = 'var(--lightorange)';
        styles.titles.breakTitle.borderBottom = '6px solid var(--lightorange)';

        styles.font.color = 'var(--lightorange)';
        styles.background.background = 'var(--darkorange)';

        this.updateTimeShown(this.state.break.timeRemaining);
        this.setState(prevState => {
          return { pomodoros: prevState.pomodoros + 1, longBreakTime: false}
        });
      }

      // set new styles
      const playPauseIcon = 'fas fa-play';
      this.setState({ styles, playPauseIcon, progressPercent: 0 });

      return; // end function
    };

    // V  TIMER IS STILL RUNNING  V

    // decrement the active timer
    timer.timeRemaining--;

    this.updateTimeShown(timer.timeRemaining);
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

  // take in seconds and return minutes and seconds
  updateTimeShown(duration) { // in seconds (for now)
    let mins = Math.floor((duration/60));
    if (mins < 10) mins = `0${mins}`; // prepend 0 if < 10
    let secs = Math.floor(duration%60);
    if (secs < 10) secs = `0${secs}`; // prepend 0 if < 10
    this.setState({ showTime: {
      mins,
      secs,
      msecs: '000',
    }});
    document.title = `${mins}:${secs} - pomodoro timer`;
  }

  // --------------------------------------------------------------------------
  //                                           handle reset
  // --------------------------------------------------------------------------

  // reset all state, if button is pressed then revert to work timer
  handleReset(resetButton = false) { // normal reset by default

    // end any running timer function
    clearInterval(this.state.intervalID);

    // if this reset is from the button, revert to work timer...
    if (resetButton) {
      const styles = JSON.parse(JSON.stringify(this.state.styles));

      styles.title = {
        workTitle: {
          color: 'var(--lightred)',
          borderBottom: '6px solid var(--lightred)'
        },
        breakTitle: { color: '', borderBottom: '' },
        longBreakTitle: { color: '', borderBottom: ''},
      }

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

  // --------------------------------------------------------------------------
  //                                           handle settings toggle
  // --------------------------------------------------------------------------

  handleSettingsToggle() {
    const styles = JSON.parse(JSON.stringify(this.state.styles));
    !styles.settings.maxHeight
      ? styles.settings.maxHeight = '999px'
      : styles.settings.maxHeight = 0;
    this.setState({styles});
  }

  // --------------------------------------------------------------------------
  //                                           handle about toggle
  // --------------------------------------------------------------------------

  handleAboutToggle() {
    const styles = JSON.parse(JSON.stringify(this.state.styles));
    if (!styles.about.maxHeight) {
      styles.about.maxHeight = '999px';
      styles.about.marginTop = '2em';
      styles.about.padding = '1em 2em';
    } else {
      styles.about.maxHeight = 0;
      styles.about.marginTop = 0;
      styles.about.padding = '0 2em';
    }
    this.setState({styles});
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
          sounds={this.state.sounds}
          workSound={this.state.work.sound}
          breakSound={this.state.break.sound}
          longBreakSound={this.state.longBreak.sound}
          onSoundSelect={(timer, sound) => this.handleSoundSelect(timer, sound)}
          onSampleSound={timer => {
            if (timer === 'work') {
              this.refs[this.state.work.sound].play();
            } else if (timer === 'break') {
              this.refs[this.state.break.sound].play();
            } else if (timer === 'longBreak') {
              this.refs[this.state.longBreak.sound].play();
            }
          }}
          showSettings={this.state.showSettings}
          settingsStyle={this.state.styles.settings}
          onMouseOver={this.handleSettingsToggle}
          onMouseOut={this.handleSettingsToggle}
          />

          <div className="about-pomodoro" style={this.state.styles.about}>
            <p>The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.</p>
            <p>The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are named pomodoros, the plural in English of the Italian word pomodoro (tomato), after the tomato-shaped kitchen timer that Cirillo used as a university student.</p>
          <div className="close-btn-about" onClick={this.handleAboutToggle}>✕</div>
          </div>

          <div className="options">
            <div className="options-btn-about" onClick={this.handleAboutToggle}>about</div>
          </div>
        
        <audio src={Bell} ref="Bell" />
        <audio src={Triumph} ref="Triumph" />
        <audio src={LevelUp} ref="LevelUp" />
        <audio src={Winning} ref="Winning" />

      </div>
    );
  }
}

export default App;

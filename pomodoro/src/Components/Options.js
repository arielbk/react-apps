import React, { Component } from 'react';

class Options extends Component {
  render() {
    return (
      <div className="options">

        <div className="settings-icon">
          <i className="fas fa-cog"></i>
        </div>

        <div className="period-select period-select-work">
          <label htmlFor="input-time-work">Work period: </label>
          <select 
            value={this.props.workDuration}
            onChange={this.props.onSetTime} 
            name="input-time-work" 
            className="input-time-work"
            ref="workInput"
          >
            <option value="10">10s</option>
            <option value="300">5</option>
            <option value="600">10</option>
            <option value="900">15</option>
            <option value="1200">20</option>
            <option value="1500" defaultValue>25</option>
            <option value="1800">30</option>
            <option value="2100">35</option>
          </select>
        </div>

        <div className="period-select period-select-break">
          <label htmlor="input-time-break">Break period: </label>
          <select 
            value={this.props.breakDuration} 
            onChange={this.props.onSetTime}
            name="input-time-break" 
            className="input-time-break"
            ref="breakInput"
          >
            <option value="5">5s</option>
            <option value="300" defaultValue>5</option>
            <option value="600">10</option>
            <option value="900">15</option>
            <option value="1200">20</option>
            <option value="1500" >25</option>
            <option value="1800">30</option>
            <option value="2100">35</option>
          </select>
        </div>

    </div>
    );
  }
}

export default Options;

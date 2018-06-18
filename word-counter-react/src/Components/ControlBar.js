// Having this as a separate component may be superfluous, but... it's for practice

import React from 'react';

function ControlBar(props) {
    return (
      <form className="main-form">
        <span className="number-chooser">
          Display top <input value={props.wordsToShowValue} onChange={props.onWordsToShowChange} type="number" className="top-number" min="1" /> words
        </span>
      </form>
    )
}

export default ControlBar;
// this is just a little transparent link box to the GitHub repo of the project
// links to font awesome icon for github, this is linked through the cdn in index.html

import React from 'react';
import '../css/github.css';

function GitHub(props) {
    return (
      <a className='gh-link' href='https://github.com/arielbk/react-apps/tree/master/word-counter-react/src'>
        <div className='gh-container'>
            <i className="fab fa-github gh-logo"></i>
            <br />
            Check out the GitHub Repo!
        </div>
      </a>
    )
}

export default GitHub;
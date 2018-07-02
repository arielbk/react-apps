// this is just a little transparent link box to the GitHub repo of the project

import React from 'react';
import '../assets/css/github.css';

function GitHub(props) {
    return (
      <a className='gh-link' href='https://github.com/arielbk/react-apps/tree/master/image-gallery-react/src'>
        <div className='gh-container'>
            <i className="fab fa-github gh-logo"></i>
            <br />
            Check out the GitHub Repo!
        </div>
      </a>
    )
}

export default GitHub;
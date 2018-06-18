// Having this as a separate component may be superfluous, but... it's for practice

import React from 'react';

function Output(props) {

  // thanks to this medium article by Quynh Nhu To Tuan: https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
  let produceContent = () => {
    let table = [];

    // outer loop for every parent <tr>
    for (let i = 0; i < props.topWords.length && i < props.wordsToShow; i++) {

      if (!props.topWords[i]) {
        console.table(props.topWords);
        console.log(i);
        return;  
      }

      // populate
      table.push(
        <tr key={props.topWords[i].word}>
          <td>{i+1}</td>
          <td>{props.topWords[i].word}</td>
          <td>{props.topWords[i].frequency}</td>
        </tr>
      );

    }
    return table;
  }
  
  return (
  <table className="output-table">
    <thead>
      <tr>
        <th className="table-number">#</th>
        <th className="table-word">Word</th>
        <th className="table-frequency">Frequency</th>
      </tr>
    </thead>
    <tbody className="output">

      {produceContent()}

    </tbody>

    <tfoot><tr><td colSpan="3">Total words: {props.numWords} | Total unique words: {props.topWords.length}</td></tr></tfoot>

  </table>
  )
}

export default Output;
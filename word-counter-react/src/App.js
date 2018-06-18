import React, { Component } from 'react';
import ControlBar from './Components/ControlBar';
import Output from './Components/Output';
import GitHub from './Components/GitHub';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInput: '',
      wordsToShow: 25,
      numWords: 0,
      topWords: [],
    }
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleWordsToShowChange = this.handleWordsToShowChange.bind(this);
    this.updateTopWords= this.updateTopWords.bind(this);
  }

  updateTopWords() {
    // keep track of total number of words (i.e. not just unique words)
    // this is just so that a whole other calculation need not be made at the end
    let numWords = 0;

    const words = this.state.textInput
      // the beauty of chained array methods
      .toLowerCase()
      .split(' ')
      // remove all non alpha characters and increment words counter on each pass
      .map(x => x.replace(/[^a-z]/gi, ''))
      // create an array of objects with the word and its frequency
      .reduce((totalWords, singleWord) => {
        if (!singleWord){ // removes trailing space problems...
          return totalWords
          // creates a new entry with a frequency of 1 if the word does not yet exist
        } else if (totalWords.every(element => element['word'] !== singleWord)) {
          const newElement = {word: singleWord, frequency: 1};
          totalWords.push(newElement);
          numWords++;
          // if the word is already there, then increment its frequency
        } else {
          totalWords.forEach(element => {if (element.word === singleWord) element.frequency++});
          numWords++;
        }
        return totalWords;
      }, [])
      // sort the array from highest to lowest frequency
      .sort((a,b) => b.frequency-a.frequency);

    this.setState({ topWords: words, numWords });
  }

  handleTextInput(e) {
    this.setState({ textInput: e.target.value }, () => this.updateTopWords());
  }

  handleWordsToShowChange(e) {
    this.setState({ wordsToShow: e.target.value }, () => this.updateTopWords());
  }

  render() {
    return (
      <div>
        <div className="container">
          <h1>Word Counter</h1>
          <h3>Type or paste some text below and list the frequency of each word!</h3>
          <textarea 
          className='text-input' 
          value={this.state.textInput} 
          onChange={this.handleTextInput}
          />
          <ControlBar 
          onWordsToShowChange={this.handleWordsToShowChange}
          wordsToShowValue={this.state.wordsToShow}
          onSubmit={this.handleSubmit}
          />
          <Output 
            wordsToShow={this.state.wordsToShow}
            numWords={this.state.numWords}
            topWords={this.state.topWords}
          />
        </div>
        <GitHub />
      </div>
    );
  }
}

export default App;
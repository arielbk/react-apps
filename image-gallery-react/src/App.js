import React, { Component } from 'react';

class DisplayImage extends Component {
  render() {
    return <h1>Display Image</h1>
  };
}

class ImageThumbs extends Component {
  render() {
    return <h2>Image thumbnails. Click one and the main image blurs out and in again with the new image.</h2>
  };
}

class AddPhoto extends Component {
  render() {
    return <h3>There should be an option here to add a photo, too </h3>
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [
        { photoUrl: 'unsplash', description: 'a short description', selected: true },
        { photoUrl: 'anotherunsplash', description: 'and another short description', selected: false }
      ]
    }
  }

  render() {
    return (
      <div className="container">
        <DisplayImage />
        <ImageThumbs />
        <AddPhoto />
        <p>Click, or use your keyboard arrow keys to choose a photo</p>

      </div>
    );
  }
}

export default App;

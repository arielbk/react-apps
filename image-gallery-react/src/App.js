import React, { Component } from 'react';

class DisplayImage extends Component {
  render() {
    return <img src="https://source.unsplash.com/random/600x450" alt="randomly chosen" />
  };
}

class ImageThumbs extends Component {
  render() {
    return (
    <div className="imageThumbs">
      {this.props.photos.map(photo => 
        <img 
          src={photo.photoUrl} 
          alt={photo.description} 
          key={photo.photoUrl} 
          className={photo.selected ? 'selected' : 'unselected'}
        />
      )}
    </div>
    )
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
        { photoUrl: 'https://source.unsplash.com/random/600x451', description: 'a short description', selected: true },
        { photoUrl: 'https://source.unsplash.com/random/600x452', description: 'and another short description', selected: false },
        { photoUrl: 'https://source.unsplash.com/random/600x453', description: 'and another short description', selected: false },
        { photoUrl: 'https://source.unsplash.com/random/600x454', description: 'and another short description', selected: false },
        { photoUrl: 'https://source.unsplash.com/random/600x455', description: 'a short description', selected: false },
        { photoUrl: 'https://source.unsplash.com/random/600x456', description: 'and another short description', selected: false },
        { photoUrl: 'https://source.unsplash.com/random/600x457', description: 'and another short description', selected: false },
      ]
    }
  }

  render() {
    return (
      <div className="container">
        <DisplayImage />
        <ImageThumbs 
          photos={this.state.photos}
        />
        <AddPhoto />
        <p>Click, or use your keyboard arrow keys to choose a photo</p>

      </div>
    );
  }
}

export default App;

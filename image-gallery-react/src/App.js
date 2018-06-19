import React, { Component } from 'react';

class DisplayImage extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.photo[0]);
  }

  render() {
    return (
      <div className="display-image">
        <img src={this.props.photo[0].photoUrl} alt={this.props.photo[0].description} />
      </div>
    )
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
          className={photo.selected ? 'selected' : ''}
          onClick={() => this.props.onSelectImage(photo)}
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

    this.handleSelectImage = this.handleSelectImage.bind(this);
  }

  handleSelectImage(newImage) {
    let photosClone = [...this.state.photos];
    photosClone.forEach(photo => photo.photoUrl === newImage.photoUrl ? photo.selected = true : photo.selected = false);
    this.setState({ photos: photosClone });
  }

  render() {
    return (
      <div className="container">
        <DisplayImage 
          photo={this.state.photos.filter(photo => photo.selected)}
        />
        <ImageThumbs 
          photos={this.state.photos}
          onSelectImage={this.handleSelectImage}
        />
        <AddPhoto />
        <p>Click, or use your keyboard arrow keys to choose a photo</p>

      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
// import uuid from 'uuid';


class DisplayImage extends Component {
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
    <div className="image-thumbs">
      {this.props.photos.map(photo => 
        <div key={photo.uuid} className="img-thumb">
          <img 
            src={photo.photoUrl} 
            alt={photo.description} 
            className={photo.selected ? 'selected' : ''}
            onClick={() => this.props.onSelectImage(photo)}
          />
        </div>
      )}
    </div>
    )
  };
}

class AddPhoto extends Component {
  render() {
    return <div className="img-thumb img-add" onClick={this.props.onAddPhoto}>Add a photo</div>
  };
}

class App extends Component {
  constructor(props) {
    super(props);
    const uuidv4 = require('uuid/v4');
    this.state = {
      photos: [
        { uuid: uuidv4(), photoUrl: 'https://source.unsplash.com/random/1600x1200', description: 'a short description', selected: true },
        { uuid: uuidv4(), photoUrl: 'https://source.unsplash.com/random/1600x1201', description: 'and another short description', selected: false },
        { uuid: uuidv4(), photoUrl: 'https://source.unsplash.com/random/1600x1202', description: 'and another short description', selected: false },
        { uuid: uuidv4(), photoUrl: 'https://source.unsplash.com/random/1600x1203', description: 'and another short description', selected: false },
      ]
    }

    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleAddPhoto = this.handleAddPhoto.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.randomImageCounter = 4;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress)
  }

  handleSelectImage(newImage) {
    let photosClone = [...this.state.photos];
    photosClone.forEach(photo => photo.uuid === newImage.uuid ? photo.selected = true : photo.selected = false);
    this.setState({ photos: photosClone }); // oooh am I just making a shallow copy in this function and changing it directly...?
  }

  handleKeyPress(e) {
    if (e.key > 0 && e.key < 9) {
      this.handleSelectImage(this.state.photos[e.key-1]);
      return;
    }

    // otherwise figure out the index of the current image
    const current = this.state.photos.filter(photo => photo.selected === true);
    const currentIndex = this.state.photos.indexOf(current[0]);

    // now for the up and down arrow
    if (e.key === 'ArrowUp' && currentIndex > 0) {
      this.handleSelectImage(this.state.photos[currentIndex-1]);
    } else if (e.key === 'ArrowDown' && currentIndex < this.state.photos.length - 1) {
      this.handleSelectImage(this.state.photos[currentIndex+1]);
    }
  
  }

  handleAddPhoto() {
    const photos = [...this.state.photos];
    const uuidv4 = require('uuid/v4');
    const newPhoto = { uuid: uuidv4(), photoUrl: `https://source.unsplash.com/random/1600x${1200+this.randomImageCounter}`, description: 'a short description', selected: false }
    photos.push(newPhoto);
    this.setState({ photos });
    this.randomImageCounter++;
  }

  render() {
    return (
      <div className="container">
        <DisplayImage 
          photo={this.state.photos.filter(photo => photo.selected)}
        />
        <p>Click, or use your keyboard arrow keys to choose a new photo</p>
        <div className="sidebar">
        <ImageThumbs 
          photos={this.state.photos}
          onSelectImage={this.handleSelectImage}
        />
        <AddPhoto 
          onAddPhoto={this.handleAddPhoto} />
        </div>

      </div>
    );
  }
}

export default App;

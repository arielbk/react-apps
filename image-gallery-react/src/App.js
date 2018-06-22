import React, { Component } from 'react';
import GitHub from './Components/GitHub';

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
  constructor(props) {
    super(props);
    this.setState = {
      
    }
  }

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

// make this a modal and build it out
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
      ],
      addPhotoSelected: false,
    }

    this.handleSelectImage = this.handleSelectImage.bind(this);
    this.handleAddPhoto = this.handleAddPhoto.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.randomImageCounter = 4;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentDidUpdate() {
    const sidebar = document.querySelector('.sidebar');
    const addPhotobox = document.querySelector('.img-add');

    sidebar.style.height = `${(this.state.photos.length+1) * 186}px`;

    const selected = this.state.photos.filter(photo => photo.selected);
    const index = this.state.photos.indexOf(selected[0]);
    if (!this.state.addPhotoSelected) {
      sidebar.style.marginTop = `-${index * 138}px`;
      addPhotobox.classList.remove('img-add-selected');
    } else {
      // move sidebar up for selecting add photo
      sidebar.style.marginTop = `-${index * 138 + 138}px`;
      // provide styles so user knows it is selected
      
      addPhotobox.classList.add('img-add-selected');
      // add listener for pressing enter while it is selected
    }
  }

  handleSelectImage(newImage) {
    const mainImage = document.querySelector('.display-image');
    let photosClone = JSON.parse(JSON.stringify(this.state.photos));
    photosClone.forEach(photo => photo.uuid === newImage.uuid ? photo.selected = true : photo.selected = false);
    mainImage.classList.add('blur');
    this.setState({ photos: photosClone }, () => {
      setTimeout(() => mainImage.classList.remove('blur'), 200);
    }
  );
  }

  handleKeyPress(e) {

    // // THIS IS FOR NUMBER KEYS TO SELECT A PHOTO - BUT ITS NOT REALLY NEEDED (FOR NOW)
    // if (e.key > 0 && e.key < 9) {
    //   if (e.key > this.state.photos.length) return;
    //   sideBar.style.marginTop = `${(Number(e.key)+1) * -186}px`;
    //   console.log(sideBar.style.height);
    //   this.handleSelectImage(this.state.photos[e.key-1]);
    //   return;
    // }

    // figure out the index of the current image
    const current = this.state.photos.filter(photo => photo.selected === true);
    const currentIndex = this.state.photos.indexOf(current[0]);

    // now for the up and down arrow
    if (e.key === 'ArrowUp' && currentIndex === this.state.photos.length - 1 && this.state.addPhotoSelected) {
      // moving selection away from 'add new photo'
      this.setState({ addPhotoSelected: false });
    } else if (e.key === 'ArrowUp' && currentIndex > 0) {
      this.handleSelectImage(this.state.photos[currentIndex-1]);
    } else if (e.key === 'ArrowDown' && currentIndex < this.state.photos.length - 1) {
      this.handleSelectImage(this.state.photos[currentIndex+1]);
    } else if (e.key === 'ArrowDown' && currentIndex === this.state.photos.length - 1 && !this.state.addPhotoSelected) {
      // if we are on the last photo and press the down arrow, 'add new button' should be selected
      this.setState({ addPhotoSelected: true });
    }

    // when enter is pressed on add new photo... add a new photo
    if (e.key === 'Enter' && this.state.addPhotoSelected) {
      this.handleAddPhoto();
      this.setState({ addPhotoSelected: false });
    } else if (e.key === 'Enter') {
      this.handleSelectImage(this.state.photos[currentIndex])
    }
  }

  handleAddPhoto() {
    const photos = [...this.state.photos];
    const uuidv4 = require('uuid/v4');
    const newPhoto = { uuid: uuidv4(), photoUrl: `https://source.unsplash.com/random/1600x${1200+this.randomImageCounter}`, description: 'a short description', selected: false }
    photos.push(newPhoto);
    this.setState({ photos }, () => this.handleSelectImage(this.state.photos[this.state.photos.length-1]));
    this.randomImageCounter++;
  }

  render() {
    return (
      <div className="container">
        <DisplayImage 
          photo={this.state.photos.filter(photo => photo.selected)}
        />
        <div className="sidebar-container">
          <div className="sidebar">
          <ImageThumbs 
            photos={this.state.photos}
            onSelectImage={this.handleSelectImage}
          />
          <AddPhoto 
            onAddPhoto={this.handleAddPhoto} />
          </div>
        </div>
        <GitHub />

      </div>
    );
  }
}

export default App;

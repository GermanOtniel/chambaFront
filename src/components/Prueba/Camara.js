import React, { Component } from 'react';
import Camera from 'react-camera';

class Camara extends Component {

  state={
    evidencia:{
      archivo:""
    }
  }


  constructor(props) {
    super(props);
    this.takePicture = this.takePicture.bind(this);
  }

  takePicture() {
    this.camera.capture()
    .then(foto => {
      let archivo = URL.createObjectURL(foto);
      this.setState({evidencia:{archivo}})
      this.img.onload = () => { 
        URL.revokeObjectURL(this.src);
       }
    })
  }

  render() {
    return (
      <div style={style.container}>
        <Camera
          style={style.preview}
          ref={(cam) => {
            this.camera = cam;
          }}
        >
          <div style={style.captureContainer} onClick={this.takePicture}>
            <div style={style.captureButton} />
          </div>
        </Camera>
        <img
          alt="Foto"
          style={style.captureImage}
          ref={(img) => {
            this.img = img;
          }}
        />
        <img alt="Foto" src={this.state.evidencia.archivo}/>
      </div>
    );
  }
}

const style = {
  preview: {
    position: 'relative',
  },
  captureContainer: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 1,
    bottom: 0,
    width: '100%'
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    height: 56,
    width: 56,
    color: '#000',
    margin: 20
  },
  captureImage: {
    width: '100%',
  }
};

export default Camara;
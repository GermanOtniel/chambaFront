import React,{Component} from 'react';
import Webcam from 'react-webcam';


class Pruebas extends Component{

  state={
    imageSrc:''
  }
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({imageSrc});
  };

  render() {
    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: 'user',
    };

    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
          videoConstraints={videoConstraints}
        />
        <button onClick={this.capture}>Capture photo</button>
        <div>
          <img src={this.state.imageSrc}/>
        </div>
      </div>
    );
  }
}

export default Pruebas;
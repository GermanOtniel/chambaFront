import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import TabSup from '../Profile/TabSup';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Camera from 'react-camera';


const label = {
  color:'white'
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
  },
  hiddenImage:{
    display:"none"
  }
};

class DinamicDetail extends Component{

  state={
    dinamic:{},
    open: false,
    evidencia:{},
    takePhoto: true
  }
  
 
  // constructor(props) {
  //   super(props);
   // this.takePicture = this.takePicture.bind(this);
  // }
  takePicture = () => {
    //console.log(this.camera.state.mediaStream.active)
    this.setState({takePhoto:false})
    this.camera.capture()
    .then(foto => {
      let archivo = URL.createObjectURL(foto);
      this.setState({
        evidencia:{
          archivo:archivo
        }
      })
      //this.camera.state.mediaStream.active = false;
      this.img.onload = () => { 
        URL.revokeObjectURL(this.src);
       }
    }) 
  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
    this.setState({evidencia:{}});
    this.setState({takePhoto:true});
  };
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {evidencia} = this.state;
    evidencia[field] = value;
    console.log(evidencia)
    this.setState({evidencia}); 
  }
  showEvidencia = (e) => {
    let evidence = this.state.evidencia;
    console.log(evidence)
    this.handleClose();
  }

  componentWillMount(){
     let id = this.props.match.params.id
     this.setState({id})
    getSingleDinamic(id)
    .then(dinamic=>{
      this.setState({dinamic})
    })
    .catch(e=>alert(e));
  }
  
  render(){
    const {dinamic, takePic} = this.state;
      return (
        <div>
          <TabSup />
          <Card>
    <CardHeader
      title="NOMBRE DE MARCA"
      avatar="http://cava-alta.com/wp-content/uploads/2016/02/Tecate-logo-300x300.jpg"
    />
    <CardMedia
      overlay={<CardTitle title={dinamic.nombreDinamica} subtitle={dinamic.fechaInicio + " - " + dinamic.fechaFin} />}
    >
      <img src={dinamic.imagenPremio} alt="Referencia del premio" />
    </CardMedia>
    <CardTitle title="Modalidad:" subtitle={dinamic.modalidad} />
    <CardText>
      {dinamic.descripcion}
    </CardText>
    <CardActions>
    <FlatButton onClick={this.handleOpen} label="Participar" fullWidth={true}  backgroundColor="#D62121" labelStyle={label} disableTouchRipple={true}/>
    </CardActions>
  </Card>


  <Dialog
          title="Envia tu evidencia"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >

          
          <Paper   zDepth={2}>
            <Camera
          style={this.state.takePhoto ? style.preview : style.hiddenImage }
          ref={(cam) => {
            this.camera = cam;
          }}
        >
          <div style={style.captureContainer} onClick={this.takePicture}>
            <div style={style.captureButton} />
          </div>
        </Camera>
        
        <img
          style={style.captureImage }
          ref={(img) => {
            this.img = img;
          }}
        />
        <img style={!this.state.takePhoto ? style.captureImage : style.hiddenImage }
 src={this.state.evidencia.archivo}/>
          <Divider />
          <TextField onChange={this.onChange} name="mensaje" hintText="Aqui va tu mensaje" type="text"  underlineShow={false} />
          </Paper>
          


          <RaisedButton onClick={this.showEvidencia}  label="Enviar" secondary={true}  />
          
        </Dialog> 
        </div>
      );
    }
    
  }

  

export default DinamicDetail;
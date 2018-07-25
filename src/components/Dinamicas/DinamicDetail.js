import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import { createEvidence } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Chip from 'material-ui/Chip';
import Camera from 'react-camera';
import firebase from '../../firebase/firebase';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import './dinamica.css';

const styles2 = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

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
  },
  checkbox: {
    marginBottom: 16,
  },
  textField:{
    marginTop:-500
  }
};

class DinamicDetail extends Component{

  state={
    dinamic:{},
    open: false,
    evidencia:{},
    takePhoto: true,
    fotito:"",
    file:{},
    marcas:[]
  }
  
  getFile = e => {
    let file = this.state.file;
    let user = `${JSON.parse(localStorage.getItem('user')).correo}`;
    let fecha = String(file.lastModifiedDate).slice(4,-33);
    //aqui lo declaro
    const uploadTask = firebase.storage()
    .ref("evidencias")
    .child( fecha + user +"-"+ file.name)
    .put(file);
    //aqui agreggo el exito y el error
    uploadTask
    .then(r=>{
      const {evidencia} = this.state;
      evidencia.archivo =  r.downloadURL;
      this.setState({evidencia})
    })
    .catch(e=>console.log(e+'ERRRRROOOOOR'))
  };
  onCheck = (e) => {
    this.getFile();
  }
  takePicture = () => {
    this.setState({takePhoto:false})
    this.camera.capture()
    .then(blob => {
      let archivo = URL.createObjectURL(blob);
      let file = new File([blob], "evidencia.jpg", {type: "image/jpeg", lastModified: Date.now()});
      this.setState({fotito:archivo,file:file})
    })

  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,evidencia:{},takePhoto:true});
  };
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {evidencia} = this.state;
    evidencia[field] = value;
    this.setState({evidencia}); 
  }
  sendEvidencia = (e) => {
    const idUser = `${JSON.parse(localStorage.getItem('user'))._id}`;
    const idDinamica = this.state.dinamic._id;
    const {evidencia} = this.state;
    const {dinamic} = this.state;
    evidencia.creador = idUser;
    evidencia.dinamica = idDinamica;
    evidencia.modalidad = dinamic.modalidad;
    this.setState({evidencia});
    createEvidence(this.state.evidencia)
    .then(evidencia=>{
      //console.log(evidencia)
    })
    .catch(e=>console.log(e))
    this.handleClose();
  }

  componentWillMount(){
     let id = this.props.match.params.id
     this.setState({id})
    getSingleDinamic(id)
    .then(dinamic=>{
      let marcas =  dinamic.marcas.map(marca=> marca);
      this.setState({dinamic,marcas})
    })
    .catch(e=>alert(e));
  }
  
  
  render(){
    const {dinamic, marcas} = this.state;
      return (
        <div>
          <TabSup />
          <Card>         
            <CardMedia
              overlay={<CardTitle 
              title={dinamic.nombreDinamica} 
              subtitle={dinamic.fechaInicio + " - " + dinamic.fechaFin} />}
            >
              <img 
                src={dinamic.imagenPremio} 
                alt="Referencia del premio" 
              />
            </CardMedia>
            <CardTitle
              subtitle="Modalidad de la Dinámica" 
              title={dinamic.modalidad} 
              
            />         
            {marcas.map( (marca, index) => (
              <Chip
              key={index}
              className="dinamicDetailHijo"
              >
              <Avatar src={marca.imagen} />
                {marca.nombre}
              </Chip> 
              ))}
              <br/>
            <CardText>
              {dinamic.descripcion}
            </CardText>
            <CardActions>
              <FlatButton 
                onClick={this.handleOpen} 
                label="Participar" 
                fullWidth={true}  
                backgroundColor="#D62121" 
                labelStyle={label} 
                disableTouchRipple={true}
              />
            </CardActions>
          </Card>
        <Dialog
          title="Envia tu evidencia"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
            <Camera
              style={this.state.takePhoto ? style.preview : style.hiddenImage }
              ref={(cam) => {
                this.camera = cam;
              }}
            >
              <div style={style.captureContainer} onClick={this.takePicture}>
                <div style={style.captureButton}>
                </div >
              </div>
            </Camera>
            <img
              style={style.captureImage }
              ref={(img) => {
              this.img = img;
              }}
            />
            <img 
              style={!this.state.takePhoto ? style.captureImage : style.hiddenImage }
              src={this.state.fotito}/>
            <Divider />
            <Checkbox
              label="¿Usaras esa foto?"
              style={!this.state.takePhoto ? style.checkbox : style.hiddenImage }
              onCheck={this.onCheck}
            />
            <TextField
              style={style.textField} 
              onChange={this.onChange} 
              name="mensaje" 
              floatingLabelText="Mensaje"
              multiLine={true}
              hintText="Aqui va tu mensaje" 
              type="text"  
              underlineShow={false} 
            />
            <TextField 
              onChange={this.onChange} 
              name="cantidadProducto"
              floatingLabelText="Producto Vendido" 
              hintText="Cantidad" 
              type="number"  
              underlineShow={false} 
            />
            <RaisedButton 
              onClick={this.sendEvidencia}  
              label="Enviar" 
              secondary={true}  
            />
          
        </Dialog> 
      </div>
      );
    }
    
  }

  

export default DinamicDetail;
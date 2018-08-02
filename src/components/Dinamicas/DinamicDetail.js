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
import Camera from 'react-camera';
import firebase from '../../firebase/firebase';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import './dinamica.css';


const styles2 = {
  chip: {
    margin: 4,
  },
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
    height: 30,
    width: 30,
    color: '#000',
    margin: 7
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
    marcas:[],
    chipData:[]
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
  onChangeEvidence = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {chipData} =this.state;
    const {evidencia} = this.state;
    for(let i = 0; i<chipData.length;i++){
      if(field === chipData[i]._id._id){
        chipData[i].ventas = value
      }
    }
    evidencia.marcas = chipData;
    console.log(evidencia)
    this.setState({evidencia,chipData})
  }
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
      console.log(dinamic)
      let marcas = dinamic.marcaPuntosVentas.map(marca=> marca);
      let chipData = marcas
      this.setState({dinamic,marcas,chipData})
    })
    .catch(e=>alert(e));
  }
  renderChip(data) {
    return (
     <div key={data._id.nombre}>
      <Chip
       style={styles2.chip}
      >
      <Avatar src={data._id.imagen} />
        {data._id.nombre}
      </Chip>
      <TextField
      onChange={this.onChangeEvidence}
      name={`${data._id._id}`}
      type="number"
      hintText="Ventas por Marca"
    />
    <hr/>
      </div>
    );
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
              subtitle={<b className="bSubtitle"> {dinamic.fechaInicio + " - " + dinamic.fechaFin}</b>} />}
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
            <hr/>
            <b>{dinamic.modalidad === "Ventas" ? "Ventas requeridas por marca: " : "Puntos por unidad vendida: "}</b>     
            <br/><br/>
            {marcas.map( (marca, index) => (
              <div key={index}>
              <Chip
              className="dinamicDetailHijo"
              >
              <Avatar src={marca._id.imagen} />
                {marca._id.nombre}
                 <b>{dinamic.modalidad === "Ventas" ? " " + marca.puntosVentas + " ventas" : " " + marca.puntosVentas + " puntos" }</b> 
              </Chip> 
              <br/><br/>
              </div>
              ))}
              <hr/>
              <b>Descripción de la Dinámica:</b>
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
            <hr/>
            <h6>Define cuantas ventas hiciste de cada marca:</h6>
            <div style={styles2.wrapper}>
              {this.state.chipData.map(this.renderChip, this)}
            </div>
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
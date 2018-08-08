import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import { createEvidence } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import IconButton from 'material-ui/IconButton';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Camera from 'react-camera';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
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
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  }
  
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
    backgroundColor: 'red',
    borderRadius: '50%',
    height: 30,
    width: 30,
    margin: -20,
    position: 'relative'
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
    camara:false,
    fotito:"",
    file:{},
    marcas:[],
    chipData:[],
    progresoImagen:0,
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
    uploadTask.on('state_changed', (snap)=>{
      const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
      this.setState({progresoImagen});
    })
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
  setCamara = () => {
    this.setState({camara: true});
  };
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,evidencia:{},takePhoto:true,camara:false});
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
    //console.log(evidencia)
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
    })
    .catch(e=>console.log(e))
    this.handleClose();
  }

  componentWillMount(){
     let id = this.props.match.params.id
     this.setState({id})
    getSingleDinamic(id)
    .then(dinamic=>{
      let marcas = dinamic.marcaPuntosVentas.map(marca=> marca);
      let chipData = marcas
      dinamic.fechaI = dinamic.fechaInicio.slice(0,10)
      dinamic.fechaF = dinamic.fechaFin.slice(0,10)
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
      floatingLabelStyle={styles2.floatingLabelFocusStyle}
      floatingLabelFocusStyle={styles2.floatingLabelFocusStyle}
      errorText="Este campo es obligatorio"
      errorStyle={styles2.errorStyle} 
    />
    <hr/>
      </div>
    );
  }
  
  render(){
    const {dinamic, marcas,takePhoto,camara} = this.state;
      return (
        <div>
          <TabSup />
          <Card>         
            <CardMedia
              overlay={<CardTitle 
              title={dinamic.nombreDinamica} 
              subtitle={<b className="bSubtitle"> {dinamic.fechaI + " - " + dinamic.fechaF}</b>} />}
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
                backgroundColor="#546E7A" 
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

        <div style={!camara ? style.preview : style.hiddenImage}>
          <h6>Tomar foto:</h6>
        <IconButton  
        onClick={this.setCamara}>
        <FontIcon className="material-icons">camera_alt</FontIcon>
        </IconButton>
        </div>

        <div>
        <Camera style={takePhoto && camara ? style.preview : style.hiddenImage} ref={(cam) => {this.camera = cam;}}>
          <div style={style.captureContainer} onClick={this.takePicture}>
            <div style={style.captureButton}>
            </div >
          </div>
        </Camera>
        </div>
            
            <img 
              style={style.captureImage }
              ref={(img) => {
              this.img = img;
              }}
            />
            <img 
              alt="Foto"
              style={!this.state.takePhoto ? style.captureImage : style.hiddenImage }
              src={this.state.fotito}/>
            <Divider />
            <Checkbox
              label="¿Usaras esa foto?"
              style={!takePhoto ? style.checkbox : style.hiddenImage }
              onCheck={this.onCheck}
            />
            <br/>
             <LinearProgress mode="determinate" value={this.state.progresoImagen} />
          <span>{this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" : ""}</span>
         
            <br/><br/><br/>
            <TextField
              style={style.textField} 
              onChange={this.onChange} 
              name="mensaje" 
              floatingLabelText="Mensaje"
              multiLine={true}
              type="text"  
              underlineShow={true}
              floatingLabelStyle={styles2.floatingLabelFocusStyle}
              floatingLabelFocusStyle={styles2.floatingLabelFocusStyle}
              errorText="Este campo no es obligatorio"
              errorStyle={styles2.errorStyle} 
            />
            <hr/>
            <h6>Define cuantas ventas hiciste de cada marca:</h6>
            <div style={styles2.wrapper}>
              {this.state.chipData.map(this.renderChip, this)}
            </div>
            <RaisedButton 
              onClick={this.sendEvidencia}  
              label="Enviar" 
              backgroundColor="#546E7A"
              labelColor="#FAFAFA"
            />
          
        </Dialog> 
      </div>
      );
    }
    
  }

  

export default DinamicDetail;
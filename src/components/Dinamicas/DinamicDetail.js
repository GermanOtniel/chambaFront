import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import { createEvidence } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {green700,blue500,grey500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';
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
  uploadButton:{
    color:"#FAFAFA"
  },
  errorStyle2: {
    color: grey500,
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
    open2:false,
    evidencia:{},
    fotito:"",
    file:{},
    marcas:[],
    chipData:[],
    progresoImagen:0,
    marcaDetalle:{},
    boton:true,
    faltaImagen:true
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
  

  getFile = e => {
   const file = e.target.files[0];
   const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
   const date = new Date();
   const date2 = String(date).slice(4,24)
   const numberRandom = Math.random();
   const number = String(numberRandom).slice(2,16)
   const child = 'evidenceOf'+correo + date2 + number
   //aqui lo declaro
   const uploadTask = firebase.storage()
   .ref("evidencias")
   .child(child)
   .put(file);
   //aqui agreggo el exito y el error
   uploadTask
   .then(r=>{
     const {evidencia} = this.state;
     evidencia.archivo =  r.downloadURL;
     this.setState({evidencia,faltaImagen:false})
   })
   .catch(e=>console.log(e)) //task
   uploadTask.on('state_changed', (snap)=>{
     const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
     this.setState({progresoImagen});
   })
  };


  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,evidencia:{},progresoImagen:0,boton:true,faltaImagen:true});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
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
    this.setState({evidencia,chipData,boton:false})
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
    evidencia.brand = dinamic.brand;
    if(this.state.dinamic.checkEvidences === false){
      evidencia.status = "Aprobada"
    }
    this.setState({evidencia});
    createEvidence(this.state.evidencia)
    .then(evidencia=>{
    })
    .catch(e=>console.log(e))
    this.handleClose();
  }
  marca = (marca) => {
    let {marcaDetalle} = this.state;
    this.handleOpen2()
    marcaDetalle = marca._id
    marcaDetalle.descripcion = marca.descripcion
    this.setState({marcaDetalle})
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
      onInput={(e)=>{ 
        let dosDigitos = e.target.value 
        dosDigitos = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
        e.target.value = Number(dosDigitos)
        console.log(e.target.name + " " + e.target.value)
      }}
      min={0}
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
    const {dinamic, marcas,marcaDetalle} = this.state;
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
              <div onClick={()=>this.marca(marca)} key={index}>
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
                backgroundColor='#B71C1C' 
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
        <br/>
        <div className="subrayadoImagen">
          <b>{dinamic.imagen ? "Esta dinámica REQUIERE foto de tus ventas" : "Esta dinámica NO requiere foto de tus ventas"}</b>
        </div>
        <br/>
        <div style={dinamic.imagen ? style.preview : style.hiddenImage}>
        <FlatButton
            label="Elige una imagen"
            labelPosition="before"
            style={styles2.uploadButton}
            containerElement="label"
            backgroundColor="#00897B"
          > 
            <input onChange={this.getFile} name="fotoPerfil" type="file" style={styles2.uploadInput} />
          </FlatButton>
          <br/>
             <LinearProgress mode="determinate" value={this.state.progresoImagen} />
             <span>{
               this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" 
               : (this.state.progresoImagen > 0 && this.state.progresoImagen < 98 ? "Espera la imagen se está cargando..." 
               : "La imagen tarda unos segundos en cargar")
              }</span>
         
            <br/><br/>
        </div>
        <br/>
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
              errorStyle={styles2.errorStyle2} 
              rowsMax={1}
              maxLength={150}
            />
            <hr/>
            <h6>Define cuantas ventas hiciste de cada marca:</h6>
            <div style={styles2.wrapper}>
              {this.state.chipData.map(this.renderChip, this)}
            </div>
            <RaisedButton 
              disabled={ dinamic.imagen ? this.state.faltaImagen : this.state.boton}
              onClick={this.sendEvidencia}  
              label="Enviar" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
          
        </Dialog> 
        <div>
        <Dialog
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}
        >
        <div className="padreProfile">
       <h6>Información adicional de {marcaDetalle.nombre}</h6>
       <hr/>
       {marcaDetalle.descripcion}
       <br/>
       <img alt="Foto Marca" width="100" height="90" src={marcaDetalle.imagen} />   
       </div>      
        </Dialog> 
        </div>
      </div>
      );
    }
    
  }

  

export default DinamicDetail;
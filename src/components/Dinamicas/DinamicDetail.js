import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import { createEvidence,getEvidencesByDinamic } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {green700,blue500,grey500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import './dinamica.css';

const styles = {
  noRoot:{
    display:'none'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'white',
  },
  radioButton: {
    marginTop: 16,
  }
};

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
  },
  label2:{
    color:'#004D40'
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
    faltaImagen:true,
    open3:false,
    open4:false,
    newCreadores:[],
    verRanking: false
  }
  componentWillMount(){
    let id = this.props.match.params.id
    this.setState({id})
   getSingleDinamic(id)
   .then(dinamic=>{
     //console.log(dinamic)
     let marcas = dinamic.marcaPuntosVentas.map(marca=> marca);
     let chipData = marcas
     dinamic.fechaI = dinamic.fechaInicio.slice(0,10)
     dinamic.fechaF = dinamic.fechaFin.slice(0,10)
     getEvidencesByDinamic(id)
     .then(evidencias=>{
       //console.log(r)
       let creadoresArray = evidencias.map(evidencia=>evidencia.creador)
        //Aqui guardaremos los usuarios unicos es decir ya no repetidos.
        var {newCreadores} = this.state;
        // No sabemos para que es pero es util, parece q aqui se guardan los que si estan repetidos...
        var lookupObject  = {};

        //Aqui comienzan los ciclos para dejar un array con usuarios unicos:

        for(var iii in creadoresArray) {
          lookupObject[creadoresArray[iii]['_id']] = creadoresArray[iii];
        }
        for(iii in lookupObject) {
          newCreadores.push(lookupObject[iii]);
       }
       for(var i = 0; i<newCreadores.length;i++){
        for(var j = 0; j<evidencias.length;j++){
          if( newCreadores[i]._id === evidencias[j].creador._id ){
            for ( let o = 0; o < evidencias[j].marcas.length; o++){
              evidencias[j].marcas[o].id = evidencias[j].marcas[o]._id._id;
              newCreadores[i].ventasDinamica.push(evidencias[j].marcas[o]);
            }
          }
        }
      }
      var lookupObject3  = {};
      for(let z = 0; z < newCreadores.length; z++){
        for(var ii in newCreadores[z].ventasDinamica) {
          lookupObject3[newCreadores[z].ventasDinamica[ii]['id']] = newCreadores[z].ventasDinamica[ii];
        }
        for(ii in lookupObject3) {
          newCreadores[z].marcas.push(lookupObject3[ii]);
       }
      }


     for(let x = 0; x < newCreadores.length; x++){
       for (let v = 0; v < newCreadores[x].marcas.length; v++){
          for ( let y = 0; y < newCreadores[x].ventasDinamica.length; y++){
            if(newCreadores[x].marcas[v]._id._id === newCreadores[x].ventasDinamica[y]._id._id  ){
              newCreadores[x].marcas[v].puntosUsuario += newCreadores[x].ventasDinamica[y].ventas
              newCreadores[x].marcas[v].nombre = newCreadores[x].ventasDinamica[y]._id.nombre
            }
          }
      }
     }

     for (let ab = 0; ab < newCreadores.length; ab++){
      if(dinamic.modalidad === "Ventas"){
        // Y SUMAMOS SUS VENTAS PARA SACAR UN TOTAL DE VENTAS POR USUARIO
        for (let cd = 0; cd < newCreadores[ab].marcas.length; cd++){
          newCreadores[ab].total += newCreadores[ab].marcas[cd].puntosUsuario
        }
     }
     else if (dinamic.modalidad === "Puntos"){
      for (let ef = 0; ef < newCreadores[ab].marcas.length; ef++){
        newCreadores[ab].total += newCreadores[ab].marcas[ef].puntosUsuario * newCreadores[ab].marcas[ef].puntosVentas
      }
     }
    }
       this.setState({newCreadores})
     })
     .catch(e=>console.log(e))
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
  handleOpen3 = () => {
    this.setState({open3: true});
  };
  handleClose3 = () => {
    this.setState({open3: false});
  };
  handleOpen4 = () => {
    this.setState({open4: true});
  };
  handleClose4 = () => {
    this.setState({open4: false});
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
    const {evidencia} = this.state;
    let fecha = new Date()
    evidencia.fecha = String(fecha).slice(0,15)
    const idUser = `${JSON.parse(localStorage.getItem('user'))._id}`;
    const idDinamica = this.state.dinamic._id;
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
    .then(r=>{
      this.handleClose();
      this.handleOpen3();
    })
    .catch(e=>{
      this.handleClose();
      this.handleOpen4()
    })
  }
  marca = (marca) => {
    let {marcaDetalle} = this.state;
    this.handleOpen2()
    marcaDetalle = marca._id
    marcaDetalle.descripcion = marca.descripcion
    this.setState({marcaDetalle})
  }

  verRanking = (e) =>{
    this.setState({verRanking:true})
  }
  noVerRanking = (e) =>{
    this.setState({verRanking:false})
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
        dosDigitos = Math.max(0, parseInt(e.target.value,10) ).toString().slice(0,2)
        e.target.value = Number(dosDigitos)
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
    const {dinamic, marcas,marcaDetalle,newCreadores,verRanking} = this.state;
    const actions = [
      <RaisedButton 
              disabled={ dinamic.imagen ? this.state.faltaImagen : this.state.boton}
              onClick={this.sendEvidencia}  
              label="Enviar" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
    ];
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
              <div style={verRanking ? styles.root : styles.noRoot}>
              <b>{newCreadores[0] ? "Ranking: " : ""}</b>
              <FlatButton 
                onClick={this.noVerRanking} 
                primary={true}
                label={newCreadores[0] ? "Ocultar" : "Aún no hay ranking :(" }
                labelStyle={styles.label2} 
              />
                <GridList style={styles.gridList} cols={1}>
                  {newCreadores.sort((a, b) => b.total - a.total ).map((creador,index) => (
                <GridTile
                  key={index}
                  title={dinamic.modalidad === "Ventas" ? creador.total +' ventas' : creador.total + ' puntos'}
                  subtitle={ creador.nombre && creador.apellido ? index+1 + ') ' + creador.nombre + " " + creador.apellido : index+1 + ') ' + creador.correo  }
                  titleStyle={styles.titleStyle}
                  // actionIcon={<IconButton onClick={() => this.detalleVenta(creador)} ><FontIcon color="white" className="material-icons">equalizer</FontIcon></IconButton>}
                  titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                >
                  <img width="150px" alt="Foto Usuario" src={creador.fotoPerfil ? creador.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Fuser.png?alt=media&token=f699f557-33b4-44d2-9de5-442e791b746a"} />
                </GridTile>
                ))}
                </GridList>
            </div>
            <hr/>
              <b>Descripción de la Dinámica:</b>
            <CardText>
              {dinamic.descripcion}
            </CardText>
            <CardActions>
              <FlatButton 
                onClick={this.handleOpen} 
                label="Participar" 
                fullWidth={false}  
                backgroundColor='#B71C1C' 
                labelStyle={label} 
                disableTouchRipple={true}
              />
              <FlatButton 
                onClick={this.verRanking} 
                label="Ver Ranking" 
                fullWidth={false}  
                backgroundColor='#004D40' 
                labelStyle={label} 
                disableTouchRipple={true}
              />
            </CardActions>  
          </Card>
        <Dialog
          title="Envia tu evidencia"
          modal={false}
          actions={actions}
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
        <div>
        <Dialog
          modal={false}
          open={this.state.open3}
          onRequestClose={this.handleClose3}
          autoScrollBodyContent={true}
        >
        <div className="padreProfile">
              Tu evidencia ha sido creada satisfactoriamente, tan solo debes de 
              esperar a que esta sea Aprobada para asi asignarte tus ventas o puntos.
              <br/>
             
       </div>      
        </Dialog> 
        </div>
        <div>
        <Dialog
          modal={false}
          open={this.state.open4}
          onRequestClose={this.handleClose4}
          autoScrollBodyContent={true}
        >
              <div className="padreProfile">
              Parece que algo salió mal...asegurate de estar conectado a Internet e ¡Inténtalo de nuevo!
              </div>      
        </Dialog> 
        </div>
      </div>
      );
    }
    
  }

  

export default DinamicDetail;
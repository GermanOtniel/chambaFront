import React, {Component} from 'react';
import {getSingleUser,editProfile} from '../../services/auth';
import FontIcon from 'material-ui/FontIcon';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import LinearProgress from 'material-ui/LinearProgress';
import firebase from '../../firebase/firebase';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
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
  }
};


class Documentos extends Component{

  state={
    user: {},
    open:false,
    open2:false,
    identificacion:"",
    acta:"",
    curp:"",
    documentos:[],
    newUser:{},
    progresoImagen:0
  }

    // CUANDO SE MONTA EL COMPONENTE TRAEMOS AL USUARIO MEDIANTE SU ID, Y REVISAMOS, SI SU CUENTA NO ESTA CONFIRMADA Y 
    // NO SE LE HA MANDADO CORREO PUES LE MANDAMOS UN CORREO PARA QUE CONFIRME SU CUENTA, EL CORREO ENVIA LA DIRECCION DE NUESTRO BACKEND
    // Y POSTERIORMENTE EN EL BACKEND SE CREARA UN CORREO Y UN LINK PARA QUE CUANDO EL USUARIO DE CLICK EN ESE LINK SU CIENTA SE CONFIRME
    // MIENTRAS NO CONFIRME SU CUENTA EL USUARIO UN DIALOGO LE SEGUIRA APARECIENDO Y RECORDANDO QUE NO HA CONFIRMADO SU CUENTA

    // TAMBIEN TRAEMOS TODOS LOS CENTROS QUE EXISTEN EN NUESTRA APP PARA QUE ELIJA ALGUNO DE ELLOS, COMO EL CENTRO DE CONSUMO EN EL QUE TRABAJA
  componentWillMount(){
    let {identificacion,acta,curp,documentos} = this.state;
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
   getSingleUser(id)
   .then(user=>{
     identificacion = user.documentos.idOficial;
     acta = user.documentos.actaNac;
     curp = user.documentos.curp;
     documentos = [
       {
         nombre:"Identificación Oficial",
         imagen: identificacion,
         featured: true
       },
       {
         nombre:"Acta de Nacimiento",
         imagen:acta,
         featured: true
       },
       {
         nombre:"CURP",
         imagen:curp,
         featured:true
       }
     ]
    this.setState({user,identificacion,acta,curp,documentos,newUser:user})
   })
   .catch(e=>console.log(e));
 }

  getFile=(documento,e)=>{
    let id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    const file = e.target.files[0];
    const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
    const date = new Date();
    const date2 = String(date).slice(0,24)
    const child = date2 + documento.nombre
    const carpet = "documentos/" + correo
    //aqui lo declaro
    const uploadTask = firebase.storage()
    .ref(carpet)
    .child(child)
    .put(file);
    //aqui agreggo el exito y el error
    uploadTask
    .then(r=>{
      const {newUser,documentos} = this.state;
      if(documento.nombre === "Identificación Oficial"){
        newUser.documentos.idOficial =  r.downloadURL;
        documentos[0].imagen = r.downloadURL;
      }
      if(documento.nombre === "Acta de Nacimiento"){
        newUser.documentos.actaNac =  r.downloadURL;
        documentos[1].imagen = r.downloadURL;
      }
      if(documento.nombre === "CURP"){
        newUser.documentos.curp =  r.downloadURL;
        documentos[2].imagen = r.downloadURL;
      }
      editProfile(newUser,id)
        .then(user=>{
        })
        .catch(e=>console.log(e))
        this.setState({newUser,documentos})
    })
    .catch(e=>console.log(e)) //task
    uploadTask.on('state_changed', (snap)=>{
      const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
      if(progresoImagen >= 0 && progresoImagen < 100){
        this.setState({open2:true})
      }
      else if (progresoImagen === 100){
        this.setState({open:true,open2:false})
      }
      this.setState({progresoImagen});
    })
  }

  handleClose=()=>{
    this.setState({open:false,progresoImagen:0})
  }

  render(){
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ]
    const {open,documentos,open2} =this.state;
      return (
        <div className="padreProfile">
        <TabSup />
        <div className="padreProfile">
          <div className="h5EnviarEvi">
            <FontIcon className="material-icons ">insert_drive_file</FontIcon>
            <h4>Mis Documentos</h4>
          </div> 
          <hr/>      
        </div>
        <div style={styles.root}>
          <GridList
            cols={2}
            cellHeight={200}
            padding={1}
            style={styles.gridList}
          >
            {documentos.map((documento,index) => (
              <GridTile
                key={index}
                title={documento.nombre}
                actionIcon={<FlatButton
                  label={<FontIcon style={{color:'white'}} className="material-icons">note_add</FontIcon>}
                  labelPosition="before"
                  style={styles.uploadButton}
                  containerElement="label"
                > 
                  <input onChange={(e)=>this.getFile(documento,e)} name="fotoPerfil" type="file" style={styles.uploadInput} />
                </FlatButton>}
                actionPosition="left"
                titlePosition="top"
                titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                cols={documento.featured ? 2 : 1}
                rows={documento.featured ? 2 : 1}
              >
                <img alt={documento.nombre} src={documento.imagen} />
              </GridTile>
            ))}
          </GridList>
        </div>
        <div>
        <Dialog
          title="Información:"
          modal={false}
          open={open}
          autoScrollBodyContent={true}
          actions={actions}
          onRequestClose={this.handleClose}
        >
          <div className="padreProfile">
            Tu documento se ha actualizado correctamente.
          </div>      
        </Dialog> 
        </div>
        <div>
        <Dialog
          title="Tu imagen se esta cargando:"
          modal={false}
          open={open2}
          autoScrollBodyContent={true}
        >
          <b>Espera un poco...</b>
          <LinearProgress mode="determinate" value={this.state.progresoImagen} />
        </Dialog> 
        </div>
        </div>
      );
    }
    
  }
  

export default Documentos;

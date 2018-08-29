import React, {Component} from 'react';
import {getSingleUser} from '../../services/auth';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import { editProfile,sendEmailConfirmation } from '../../services/auth';
import {salir} from '../../services/auth';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import { getCenters } from '../../services/centros';
import TabSup from './TabSup';
import FlatButton from 'material-ui/FlatButton';
import firebase from '../../firebase/firebase';
import './profile.css';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};
const styles = {
 
  autoComplete: {
    display: 'block',
    marginBottom: '-12%'
  },
  autoHidden: {
    display: 'none'
  },
  errorStyle: {
    color: green700,
  },
  floatingLabelFocusStyle: {
    color: blue500,
  },
  hintText:{
    color: blue500,
    fontSize: '16px'
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

class Profile extends Component{

  state={
    id: null,
    user: {},
    open: false,
    newProfile:{},
    centers:[],
    centroConsumo:'',
    progresoImagen:0,
    open2:false,
    newNotification:{},
    telefono:"",
    nombre:"",
    nombreUsuario:"",
    correo:"",
    fotoPerfil:"",
    open3:false
  }
      //    ALERTA DE NOTIFICACIONES EN EL SITIO
    // const messaging = firebase.messaging();
    
    // messaging.requestPermission()
    // .then(function(){
    //   console.log('Tienes permiso!')
    // })
    // .catch(function(err){
    //   console.log('Error ocurred!')
    // })
    //let {user} = this.state;

    // NOTIFICACIONES PUSH 
  //   Notification.requestPermission(status => {
  //     console.log('Notification permission status:', status);
  // });
    // NOTIFICACIONES PUSH

  componentWillMount(){
    let {open3} = this.state;
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    this.setState({id})
   getSingleUser(id)
   .then(user=>{
    if(user.cuentaConfirmada === false && user.correoEnviado === false){
      let bodyMessage = {
        dest: `${JSON.parse(localStorage.getItem('user')).correo}`,
        sitio: "http://verificacion.1puntocinco.com:3000/confirm/"
      }
      sendEmailConfirmation(bodyMessage,id)
      .then(r=>{
        //console.log(r)
      })
      .catch(e=>console.log(e))
    }
    if (user.cuentaConfirmada === false ){
      open3 = true
      this.setState({open3})
    }
     let centroConsumo = user.centroConsumo.nombre;
     user.centro = user.centroConsumo.nombre
     this.setState({user,centroConsumo})
   })
   .catch(e=>console.log(e));
   getCenters()
   .then(centers=>{
     this.setState({centers})
   })
   .catch(e=>alert(e))
 }

  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newProfile} = this.state;
    newProfile[field] = value;
    this.setState({newProfile}); 
  }

  // onChange2 = (e) => {
  //   const field = e.target.name;
  //   const value = e.target.value;
  //   const {newNotification} = this.state;
  //   newNotification[field] = value;
  //   this.setState({newNotification}); 
  // }


  // PROBANDO NOTIFIACIONES PUSH
  //  displayNotification = (body) => {
  //   if (Notification.permission === 'granted') {
  //     navigator.serviceWorker.getRegistration().then(reg => {
  //       var options = {
  //         body: body.cuerpo,
  //         icon: 'https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo15.jpg?alt=media&token=70b5662e-bdb4-4d88-9174-7731e6c94340',
  //         vibrate: [100, 50, 100],
  //         data: {
  //           dateOfArrival: Date.now(),
  //           primaryKey: 1
  //         },
  //         actions: [
  //           {action: 'explore', title: 'Explore this new world',
  //             icon: 'https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2FCaricatura.jpg?alt=media&token=d40cbe0f-6844-4138-b0c3-98c359b64d94'},
  //           {action: 'close', title: 'Close notification',
  //             icon: 'https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Fpin%CC%83ita15.jpg?alt=media&token=788bba77-ee8f-40f2-8c09-0ff5ddcac466'},
  //         ]
  //       };
  //       reg.showNotification(body.encabezado,options);
  //     });
  //   }
  // }
  // PROBANDO NOTIFIACIONES PUSH

  getFile = e => {
    const file = e.target.files[0];
    const correo = `${JSON.parse(localStorage.getItem('user')).correo}`;
    const date = new Date();
    const date2 = String(date).slice(16,24)
    const numberRandom = Math.random();
    const number = String(numberRandom).slice(2,16)
    const child = 'profileOf'+correo + date2 + number
    //aqui lo declaro
    const uploadTask = firebase.storage()
    .ref("users")
    .child(child)
    .put(file);
    //aqui agreggo el exito y el error
    uploadTask
    .then(r=>{
      const {newProfile} = this.state;
      newProfile.fotoPerfil =  r.downloadURL;
      this.setState({newProfile})
    })
    .catch(e=>console.log(e)) //task
    uploadTask.on('state_changed', (snap)=>{
      const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
      this.setState({progresoImagen});
    })
  };
  onNewRequest = (chosenRequest) => {
    const {newProfile} = this.state;
    newProfile.centroConsumo =  chosenRequest;
    this.setState({newProfile});
  }
  sendEdit = (e) => {
    const id = this.state.id;
    const newProfile = this.state.newProfile;
    editProfile(newProfile,id)
    .then(user=>{
      this.componentWillMount()
      this.handleClose();
      this.setState({open:false,user:user})
    })
    .catch(e=>console.log(e)) 
  }
  //desloguear al usuario
  outUser = (e) => {
    salir()
    .then(logoutUser=>{
      this.props.history.push("/");
    })
    .catch(e=>alert(e))
  }
// desloguear al usuario

  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false,progresoImagen:0});
  };
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };
  handleClose3 = () => {
    this.setState({open3: false});
  };
  // sendNotification = () =>{
  //   this.displayNotification(this.state.newNotification)
  //   this.handleClose2()
  // }

  render(){
    const {user} =this.state;
    const actions2 = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose3}
      />,
    ];
      return (
        <div className="padreProfile">
        <TabSup />
        <ListItem
      disabled={true}
      leftAvatar={
        <Avatar
          src={ user.fotoPerfil }
          size={30}
          style={style}
        />
      }
      rightAvatar={<RaisedButton label="Salir" labelColor="#FAFAFA" backgroundColor="#B71C1C"  onClick={this.outUser} />}
      >
      </ListItem>
    <br/>
    <br/>
    <br/>
    <br/>
    <h5>¡Bienvenido <b>{user.nombreUsuario}</b>!</h5>
    <hr/>
    <span>Nombre: </span> <br/> <b>{ user.nombre && user.apellido ? user.nombre + ' ' + user.apellido : "Te recomendamos actualizar tu perfil" }</b>
    <Divider/><br/>
    <span>Centro de Consumo: </span><br/><b>{ user.centro }</b>
    <Divider/> <br/>
    <span>Número telefónico: </span><br/><b>{ user.telefono }</b>
    <Divider/>
    <span>Correo: </span> <br/> <b>{ user.correo }</b>
    <Divider/>      <br/>

    <h4>Puntos: {user.calificacion}</h4>
        <hr/>
        <div>
        <RaisedButton onClick={this.handleOpen} label="Editar Perfil" backgroundColor="#546E7A" labelColor="#FAFAFA"  />
        </div>
        {/* <br/>
        <div>
        <RaisedButton onClick={this.handleOpen2} label="Crear una notificación" backgroundColor="#B71C1C" labelColor="#FAFAFA"  />
        </div> */}
       <br/>
        <div className="button">
        <Dialog
          title="Actualiza tu Perfil"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}      
        >
          <AutoComplete
            floatingLabelText="Elige tu Centro de Consumo"
            hintText="en el que trabajas"
            hintStyle={styles.hintText}
            filter={AutoComplete.caseInsensitiveFilter}
            dataSource={this.state.centers.map(centro => centro)}
            dataSourceConfig={ {text: 'nombre', value: '_id'}  }
            onNewRequest={this.onNewRequest}
            style={styles.autoComplete}
            floatingLabelStyle={styles.floatingLabelFocusStyle}
            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
            errorText="Este campo es obligatorio solo cuando eres usuario nuevo"
            errorStyle={styles.errorStyle}
            /*style={!this.state.centroConsumo ? styles.autoComplete : styles.autoHidden }*/
          />         
           
            <TextField 
              onChange={this.onChange} 
              name="nombreUsuario" 
              hintStyle={styles.hintText}
              hintText="Nombre de Usuario" 
              type="text"  
              underlineShow={true} 
            />
            <TextField 
              onChange={this.onChange} 
              name="nombre" 
              hintStyle={styles.hintText}
              hintText="Nombre" 
              type="text"  
              underlineShow={true} 
            />
            <TextField 
              onChange={this.onChange} 
              name="apellido"
              hintStyle={styles.hintText} 
              hintText="Apellido" 
              type="text"  
              underlineShow={true} 
            />
            <TextField 
              onChange={this.onChange} 
              name="telefono"
              floatingLabelText="Número telefónico" 
              floatingLabelStyle={styles.floatingLabelFocusStyle}
              hintText="Sólo números" 
              type="text"  
              underlineShow={true} 
            />
           <br/><br/>
            <FlatButton
            label="Elige una imagen"
            labelPosition="before"
            style={styles.uploadButton}
            containerElement="label"
            backgroundColor="#00897B"
          > 
            <input onChange={this.getFile} name="fotoPerfil" type="file" style={styles.uploadInput} />
          </FlatButton>
          <br/><br/>
          <LinearProgress mode="determinate" value={this.state.progresoImagen} />
          <span>{this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" : (this.state.progresoImagen > 0 && this.state.progresoImagen < 98 ? "Espera la imagen se está cargando..." : "La imagen tarda unos segundos en cargar")}</span>
          
          <br/><br/>      
          <RaisedButton onClick={this.sendEdit}  label="Actualizar Perfil" secondary={true}  />
          
        </Dialog>  

        </div>
        <div>
          <Dialog
          title="Confirma tu correo electrónico"
          modal={false}
          actions={actions2}
          open={this.state.open3}
          onRequestClose={this.handleClose3}
        >
          Parece ser que aún no has confirmado tu dirección de correo electrónico.
          <br/><br/>
          <b>Te recomendamos visitar tu correo electrónico y seguir las instrucciones que te hemos mandado .</b>
        </Dialog>
          </div>
        {/* <div className="button">
        <Dialog
          title="Envia una notificación"
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}      
        >       
           
            <TextField 
              onChange={this.onChange2} 
              name="encabezado" 
              hintStyle={styles.hintText}
              hintText="Encabezado" 
              type="text"  
              underlineShow={true} 
            />
            <TextField 
              onChange={this.onChange2} 
              name="cuerpo" 
              hintStyle={styles.hintText}
              hintText="Cuerpo" 
              type="text"  
              underlineShow={true} 
            />
           <br/><br/>
          
          <br/><br/>      
          <RaisedButton onClick={this.sendNotification}  label="Enviar" secondary={true}  />
          
        </Dialog>  

        </div> */}
        </div>
      );
    }
    
  }
  

export default Profile;

import React, {Component} from 'react';
import {getSingleUser,salir,sendEmailConfirmation} from '../../services/auth';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TabSup from './TabSup';
import FlatButton from 'material-ui/FlatButton';
import './profile.css';

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};


class Profile extends Component{

  state={
    id: null,
    user: {},
    centers:[],
    open2:false,
    newNotification:{},
    telefono:"",
    nombre:"",
    nombreUsuario:"",
    correo:"",
    fotoPerfil:"",
    open3:false
  }

    // CUANDO SE MONTA EL COMPONENTE TRAEMOS AL USUARIO MEDIANTE SU ID, Y REVISAMOS, SI SU CUENTA NO ESTA CONFIRMADA Y 
    // NO SE LE HA MANDADO CORREO PUES LE MANDAMOS UN CORREO PARA QUE CONFIRME SU CUENTA, EL CORREO ENVIA LA DIRECCION DE NUESTRO BACKEND
    // Y POSTERIORMENTE EN EL BACKEND SE CREARA UN CORREO Y UN LINK PARA QUE CUANDO EL USUARIO DE CLICK EN ESE LINK SU CIENTA SE CONFIRME
    // MIENTRAS NO CONFIRME SU CUENTA EL USUARIO UN DIALOGO LE SEGUIRA APARECIENDO Y RECORDANDO QUE NO HA CONFIRMADO SU CUENTA

    // TAMBIEN TRAEMOS TODOS LOS CENTROS QUE EXISTEN EN NUESTRA APP PARA QUE ELIJA ALGUNO DE ELLOS, COMO EL CENTRO DE CONSUMO EN EL QUE TRABAJA
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
    if(user.centroConsumo){
      user.centro = user.centroConsumo.nombre
    }
    this.setState({user})
   })
   .catch(e=>console.log(e));
 }

 // ABRIR Y CERRA DIALOGOS INFORMATIVOS 
 // SON FACILES DE LEER ESTAS FUNCIONES POR ESO NO EXPLICO MAS
 handleOpen2 = () => {
  this.setState({open2: true});
 };
 handleClose2 = () => {
  this.setState({open2: false});
 };
 handleClose3 = () => {
  this.setState({open3: false});
 };


  // ES POR SI EL USUARIO NO RECIBIO SU CORREO DE CONFIRMACIÓN SE LE ENVIE OTRA VEZ.
  sendMessageAgain = (e) => {
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    let bodyMessage = {
      dest: `${JSON.parse(localStorage.getItem('user')).correo}`,
      sitio: "http://verificacion.1puntocinco.com:3000/confirm/"
    }
    sendEmailConfirmation(bodyMessage,id)
    .then(r=>{
      //console.log(r)
      this.handleClose3()
    })
    .catch(e=>console.log(e))
  }

  //desloguear al usuario DE LA APP ES DECIR SACARLO PAJUERA
  outUser = (e) => {
    salir()
    .then(logoutUser=>{
      this.props.history.push("/");
    })
    .catch(e=>alert(e))
  }

  goToEdit = () =>{
    let {id} = this.state;
    this.props.history.push(`/edit/${id}`);
  }
  render(){
    const {user} =this.state;
    const actions2 = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose3}
      />,
      <FlatButton
        label="Reenviar correo"
        primary={true}
        keyboardFocused={true}
        onClick={this.sendMessageAgain}
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
    <h5>¡Bienvenid@ <b>{user.nombreUsuario}</b>!</h5>
    <hr/>
    <span>Nombre: </span> <br/> <b>{ user.nombre && user.apellido ? user.nombre + ' ' + user.apellido : "Te recomendamos actualizar tu perfil" }</b>
    <Divider/><br/>
    <span>Centro de Consumo: </span><br/><b>{ user.centro }</b>
    <Divider/> <br/>
    <span>Número telefónico: </span><br/><b>{ user.telefono }</b>
    <Divider/>
    <span>Correo: </span> <br/> <b>{ user.correo }</b>
    <Divider/>      <br/>

    <h6>Consulta tus puntos ó ventas en la dinámica correspondiente</h6>
        <hr/>
        <div>
        {/* onClick={this.handleOpen} */}
        <RaisedButton onClick={this.goToEdit} label="Editar Perfil" backgroundColor="#546E7A" labelColor="#FAFAFA"  />
        </div>
        {/* <br/>
        <div>
        <RaisedButton onClick={this.handleOpen2} label="Crear una notificación" backgroundColor="#B71C1C" labelColor="#FAFAFA"  />
        </div> */}
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

import React, {Component} from 'react';
import {getSingleUser} from '../../services/auth';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import ListItem from 'material-ui/List/ListItem';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';
import { editProfile } from '../../services/auth';
import {salir} from '../../services/auth';
import {green700,blue500} from 'material-ui/styles/colors';
import LinearProgress from 'material-ui/LinearProgress';
import { getCenters } from '../../services/centros';
import TabSup from './TabSup';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
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
    display: 'block'
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
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
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
    progresoImagen:0
  }

  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    this.setState({id})
   getSingleUser(id)
   .then(user=>{
     let centroConsumo = user.centroConsumo.nombre;
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
  getFile = e => {
    const file = e.target.files[0];
    //aqui lo declaro
    const uploadTask = firebase.storage()
    .ref("users")
    .child(file.name)
    .put(file);
    //aqui agreggo el exito y el error
    uploadTask
    .then(r=>{
      console.log(r.downloadURL)
      const {newProfile} = this.state;
      newProfile.fotoPerfil =  r.downloadURL;
      this.setState({newProfile})
    })
    .catch(e=>console.log(e)) //task
    uploadTask.on('state_changed', (snap)=>{
      const progresoImagen = (snap.bytesTransferred / snap.totalBytes) * 100;
      this.setState({progresoImagen});
      console.log(this.state.progresoImagen)
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
      this.handleClose();
      this.setState({open:false,user})
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

  render(){
    const {user} =this.state;

      return (
        <div className="padreProfile">
        <TabSup />
        <Paper className="paperProfile" zDepth={5} rounded={false}>
        <ListItem
      disabled={true}
      leftAvatar={
        <Avatar
          src={user.fotoPerfil}
          size={30}
          style={style}
        />
      }
      rightAvatar={<FloatingActionButton secondary={true} onClick={this.outUser} >
      <FontIcon className="material-icons">exit_to_app</FontIcon>
    </FloatingActionButton>}
      >
      </ListItem>
    <br/>
    <br/>
    <br/>
    <br/>
    <h2>Perfil</h2>
    <span>Nombre de Usuario: </span><br/> <b>{user.nombreUsuario}</b>
    <br/>
    <span>Centro de Consumo: </span><br/><b>{this.state.centroConsumo}</b>
    <br/>
    <span>Nombre: </span> <br/> <b>{user.nombre + ' ' + user.apellido}</b>
    <br/>
    <span>Correo: </span> <br/> <b>{user.correo}</b>
    <br/>
    <h4>Puntos: {user.calificacion}</h4>

        <hr/>
        <div>
        <RaisedButton onClick={this.handleOpen} label="Editar Perfil" primary={true}  />
        </div>
       <br/>
        </Paper>
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
            hintText="En el que trabajas"
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
          <Divider />
            <TextField 
              onChange={this.onChange} 
              name="nombreUsuario" 
              hintText="Nombre de Usuario" 
              type="text"  
              underlineShow={true} 
            />
            <Divider />
            <TextField onChange={this.onChange} name="nombre" hintText="Nombre" type="text"  underlineShow={true} />
            <Divider />
            <TextField onChange={this.onChange} name="apellido" hintText="Apellido" type="text"  underlineShow={true} />
            <Divider />
            <TextField onChange={this.onChange} name="codigoPostal" hintText="Código Postal" type="Codigo Postal"  underlineShow={true} />
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
          <span>{this.state.progresoImagen >= 100 ? "Listo tu imagen se ha cargado correctamente!" : "Espera la imagen se esta cargando..."}</span>
          <br/><br/>      
          <Divider />
          <RaisedButton onClick={this.sendEdit}  label="Actualizar Perfil" secondary={true}  />
          
        </Dialog>  

        </div>
        </div>
      );
    }
    
  }
  

export default Profile;

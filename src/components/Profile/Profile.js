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
import { getCenters } from '../../services/centros';
import TabSup from './TabSup';
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
  }
};

class Profile extends Component{

  state={
    id: null,
    user: {},
    open: false,
    newProfile:{},
    centers:[],
    centroConsumo:''
  }

  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    console.log('IIIIIIDDDDD', id)
    this.setState({id})
   getSingleUser(id)
   .then(user=>{
     let centroConsumo = user.centroConsumo.nombre;
     this.setState({centroConsumo})
     this.setState({user})
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
    console.log(newProfile)
    this.setState({newProfile}); 
  }
  getFile = e => {
    const file = e.target.files[0];
    console.log(file)
    //aqui lo declaro
    const uploadTask = firebase.storage()
    .ref("testing")
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
    //aqui reviso el progreso
    // uploadTask.on('state_changed', (snap)=>{
    //   const total = (snap.bytesTransferred / snap.totalBytes) * 100;
    //   this.setState({total});
    // })

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
    .then(perfilEditado=>{
      this.componentWillMount();
      this.setState({open:false})
    })
    .catch(e=>console.log(e)) 
  }
  //desloguear al usuario
  outUser = (e) => {
    salir()
    .then(logoutUser=>{
      console.log(logoutUser)
      this.props.history.push("/");
    })
    .catch(e=>alert(e))
  }
// desloguear al usuario

  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
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
      >
      </ListItem>
    <br/>
    <br/>
    <br/>
    <br/>
    <h2>Perfil</h2>
    <span>Nombre de Usuario: {user.nombreUsuario}</span>
    <br/>
    <span>Centro de Consumo: {this.state.centroConsumo}</span>
    <br/>
    <span>Nombre: {user.nombre}</span>
    <br/>
    <span>Apellido: {user.apellido}</span>
    <br/>
    <span>Correo: {user.correo}</span>
    <br/>
    <span>Puntos: {user.puntos}</span>

        </Paper>
        <div className="button">
        <div>
        <RaisedButton onClick={this.handleOpen} label="Editar Perfil" primary={true}  />
        </div>
        <div className="floating">
        <FloatingActionButton secondary={true} onClick={this.outUser} >
          <FontIcon className="material-icons">exit_to_app</FontIcon>
        </FloatingActionButton>
        </div>
        <Dialog
          title="Actualiza tu Perfil"
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >


          <Paper  zDepth={2}>
          <AutoComplete
      floatingLabelText="Type 'r', case insensitive"
      filter={AutoComplete.caseInsensitiveFilter}
      dataSource={this.state.centers.map(centro => centro)}
      dataSourceConfig={ {text: 'nombre', value: '_id'}  }
      onNewRequest={this.onNewRequest}
      style={styles.autoComplete}
      /*style={!this.state.centroConsumo ? styles.autoComplete : styles.autoHidden }*/
      />            
          <Divider />
            <TextField onChange={this.onChange} name="nombreUsuario" hintText="Nombre de Usuario" type="text"  underlineShow={false} />
            <Divider />
            <TextField onChange={this.onChange} name="nombre" hintText="Nombre" type="text"  underlineShow={false} />
            <Divider />
            <TextField onChange={this.onChange} name="apellido" hintText="Apellido" type="text"  underlineShow={false} />
            <Divider />
            <TextField onChange={this.onChange} name="codigoPostal" hintText="Código Postal" type="Codigo Postal"  underlineShow={false} />
            <Divider />
            <h6>Selecciona una foto para tu perfil</h6> <input onChange={this.getFile} className="input" name="fotoPerfil" type="file" />
            <Divider />
          </Paper>
          <RaisedButton onClick={this.sendEdit}  label="Actualizar Perfil" secondary={true}  />
          
        </Dialog>  

        </div>
        </div>
      );
    }
    
  }
  

export default Profile;

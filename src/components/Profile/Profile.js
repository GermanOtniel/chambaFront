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
    open: false,
    newProfile:{},
    centers:[],
    centroConsumo:''
  }

  componentWillMount(){
    const id = this.props.match.params.id
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
    //console.log(newProfile)
    this.setState({newProfile}); 
  }
  onNewRequest(chosenRequest) {
    this.setState({
      newProfile: {
        centroConsumo:chosenRequest
      }
    })
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
          src="http://www.coordinadora.com/wp-content/uploads/sidebar_usuario-corporativo.png"
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
      onNewRequest={ this.onNewRequest.bind(this) }
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
            <h6>Selecciona una foto para tu perfil</h6> <input className="input" name="profilePic" type="file" />
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

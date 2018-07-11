// import React, {Component} from 'react';
// import {getSingleUser} from '../../services/auth';
// import TextField from 'material-ui/TextField';
// import Paper from 'material-ui/Paper';
// import Avatar from 'material-ui/Avatar';
// import ListItem from 'material-ui/List/ListItem';
// import Divider from 'material-ui/Divider';
// import Dialog from 'material-ui/Dialog';
// import RaisedButton from 'material-ui/RaisedButton';
// import AutoComplete from 'material-ui/AutoComplete';
// import { editProfile } from '../../services/auth';
// import { getCenters } from '../../services/centros';
// import './profile.css';

// const style = {
//   height: 100,
//   width: 100,
//   margin: 20,
//   textAlign: 'center',
//   display: 'inline-block',
// };

{/*class Profile extends Component{

  state={
    id: null,
    user: {},
    open: false,
    newProfile:{},
    centers:[]
  }
  dataSourceConfig = {
    text: 'textKey',
    value: 'valueKey',
  };

  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newProfile} = this.state;
    newProfile[field] = value;
    console.log(newProfile)
    this.setState({newProfile}); 
  }
  handleUpdateInput = (searchText) => {
    this.setState({
      newProfile:{
        centroConsumo:searchText
      }
    });
  };
  sendEdit = (e) => {
    const id = this.state.id;
    const newProfile = this.state.newProfile;
    editProfile(newProfile,id)
    .then(perfilEditado=>{
      console.log(perfilEditado)
    })
    .catch(e=>console.log(e))
  }

  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };

  componentWillMount(){
    const id = this.props.match.params.id
   // console.log('aqui deberia de llegar el id ' + id);
    this.setState({id})
   //usar el service para obtener el entry desde el backend 
   getSingleUser(id)
   .then(user=>{
     //console.log(user)
     this.setState({user})
   })
   .catch(e=>alert(e));
   getCenters()
   .then(centers=>{
     this.setState({centers})
     //console.log(this.state.centers)
   })
   .catch(e=>alert(e))
 }
  render(){
    const {user} =this.state;

      return (
        <div className="padreProfile">
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
    <span>Centro de Consumo: {user.centroConsumo}</span>
    <br/>
    <span>Nombre: {user.nombre}</span>
    <br/>
    <span>Apellido: {user.apellido}</span>
    <br/>
    <span>Correo: {user.correo}</span>
    <br/>
    <span>Puesto: {user.puesto}</span>

        </Paper>
        <div className="button">
        <RaisedButton onClick={this.handleOpen} label="Editar Perfil" primary={true}  />
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
      dataSource={this.state.centers.map(centro=> centro._id)}
      onUpdateInput={this.handleUpdateInput}
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
*/}
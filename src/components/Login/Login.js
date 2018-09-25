import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { login,getNewPassword,googleUser } from '../../services/auth';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { GoogleLogin } from 'react-google-login';
import './login.css'




class Login extends Component {

  state={
    newUser:{},
    user:{},
    boton:true,
    userLogged:{},
    open:false,
    open2:false,
    correo:{},
    open3:false,
    open4:false
  }
  componentWillMount(){
    console.log('Sarabi Germán esta esforzándose...')
    let usuarioGuardado;
    let hayUsuario = `${JSON.parse(localStorage.getItem('userLogged'))}`;
    if ( hayUsuario === "null" ){
      usuarioGuardado = false
    }
    else{
      usuarioGuardado = true
    }
    if(usuarioGuardado){
      let {userLogged} = this.state;
      userLogged.correo = `${JSON.parse(localStorage.getItem('userLogged')).correo}`;
      userLogged.password = `${JSON.parse(localStorage.getItem('userLogged')).password}`;
      this.setState({userLogged,boton:false,newUser:userLogged})
    }
 }
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newUser} = this.state;
    newUser[field] = value;
    if(newUser.correo.includes('@') && newUser.correo.includes('.')){
      this.setState({boton:false})
    }
    if(!newUser.correo.includes('@') || !newUser.correo.includes('.') ){
      this.setState({boton:true})
    }
    this.setState({newUser}); 
  }
  onChange2 = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {correo} = this.state;
    correo[field] = value;
    this.setState({correo}); 
  }
  sendUser = (e) => {
    localStorage.setItem('userLogged', JSON.stringify(this.state.newUser))
    e.preventDefault();
    login(this.state.newUser)
    .then(user=>{
      this.props.history.push(`/profile/${user._id}`);
    })
    .catch(e=>{
      this.handleOpen()
    })
  }
  onFailure = (error) => {
    console.log(error);
  };
  googleResponse = (response) => {
      const {user} = this.state;
      user.nombreUsuario = response.profileObj.name;
      user.correo = response.profileObj.email;
      user.googleId = response.profileObj.googleId
      this.setState({user});
      googleUser(this.state.user)
          .then(user=>{
          this.props.history.push(`/profile/${user._id}`);
      })
      .catch(e=>console.log(e))
  };
  onCheck = (e) =>{
    let {userLogged} = this.state;
    let {newUser} = this.state;
    if(e.target.name === "correo"){
        userLogged.correo = false;
        newUser.correo = ""
        this.setState({userLogged,newUser,boton:true})
    }
    else if(e.target.name === "password")
      userLogged.password = false;
      newUser.password = ""
      this.setState({userLogged,newUser,boton:true})
  }
  nada = (e) =>{
    //jajaja no hace nada pero a la vez si...esto es la programacion beibe!!!
  }
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
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
  handleOpen5 = () => {
    this.setState({open5: true});
  };
  handleClose5 = () => {
    this.setState({open5: false});
  };

  getNewPassword = () =>{
    let {correo} = this.state;
    getNewPassword(correo)
    .then(r=>{
      this.handleClose2()
      this.handleOpen3()
    })
    .catch(e=>{
      this.handleClose2()
      this.handleOpen4()
    })
  
  }
  render() {
    const {userLogged,newUser} = this.state;

    return (
      
      <div className="app" >
       <div className="paper3">
        <Paper>
          <img className="imgLogin" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed" alt="Loguito"/>
        <br/>
        <h4>Iniciar Sesión</h4>
        <TextField
          hintText="Correo electrónico"
          floatingLabelText="Correo electrónico"
          name="correo"
          onChange={this.onChange}
          onClick={userLogged.correo ? this.onCheck : this.nada}
          value={userLogged.correo ? userLogged.correo : newUser.correo}
        />
        <br/>
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password"
          onChange={this.onChange}
          onClick={userLogged.correo ? this.onCheck : this.nada}
          value={userLogged.correo ? userLogged.password : newUser.password }
        />
        <div className="hijoPaper">
        <br/>
        <RaisedButton 
        onClick={this.sendUser} 
        label="Ingresar" 
        backgroundColor="#0D47A1" 
        labelColor="#FAFAFA" 
        className="botonIngresar"
        disabled={this.state.boton} 
        />
        <br/>
        <b className="contraseñaOlvidada" onClick={this.handleOpen2}>Olvidé mi contraseña</b>
        <hr/>
        <h5 className="registrate">Si aún no estás registrado <Link to="/signup" className="linkReg">Regístrate</Link></h5>
        <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLEID}
          buttonText="Ingresa con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogleLogin"
        />
        </div> 
        </div>
        </Paper>
       </div>
      <div className="button">
        <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}      
        > 
         Ups, algo salió mal, vuelve a intentarlo. <br/><br/>
         Si aún no estas registrado da click en Regístrate.
        </Dialog>  

        </div>  
        <div className="button">
        <Dialog
          title="Restablecer contraseña"
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}      
        > 
        Parece que has olvidado tu contraseña, por favor Ingresa el correo electrónico con el cual te regístraste, ya que a esa dirección te mandaremos 
        la contraseña temporal con la cual podrás volver a Ingresar a tu cuenta.
        <br/>
        <TextField
              onChange={this.onChange2} 
              name="correito" 
              floatingLabelText="Correo electrónico"
              type="email"  
              underlineShow={true}
            />
            <br/>
            <RaisedButton 
              onClick={this.getNewPassword}  
              label="Enviar" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
        </Dialog>  

        </div> 
        <div className="button">
        <Dialog
          modal={false}
          open={this.state.open3}
          onRequestClose={this.handleClose3}
          autoScrollBodyContent={true}      
        > 
         Revisa tu correo electrónico, tu contraseña temporal ha sido enviada.
         <br/>
         Una vez que hayas Ingresado actualiza tu contraseña nuevamente.
        </Dialog>  

        </div> 
        <div className="button">
        <Dialog
          modal={false}
          open={this.state.open4}
          onRequestClose={this.handleClose4}
          autoScrollBodyContent={true}      
        > 
         El correo electrónico que ingresaste no es válido.
        </Dialog>  

        </div> 
     </div>
     
    );
  }
}

export default Login;
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { login } from '../../services/auth';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import { GoogleLogin } from 'react-google-login';
import { googleUser } from '../../services/auth';
import './login.css'




class Login extends Component {

  state={
    newUser:{},
    user:{},
    boton:true,
    userLogged:{},
    open:false
  }
  componentWillMount(){
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
  render() {
    const {userLogged,newUser} = this.state;

    return (
      
      <div className="app" >
      <div className="login2">
      <Paper className="paper2" zDepth={5}>
       <form>
         <div className="form-group">
         <h3>Inicia Sesión</h3>

           <input onClick={userLogged.correo ? this.onCheck : this.nada} onChange={this.onChange} value={userLogged.correo ? userLogged.correo : newUser.correo} name="correo" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Correo electrónico" />
           <small id="emailHelp" className="form-text text-muted">Tus datos estarán seguros con nosotros.</small>
         </div>
         <div className="form-group">
           <input onClick={userLogged.correo ? this.onCheck : this.nada} onChange={this.onChange} value={userLogged.correo ? userLogged.password : newUser.password } name="password" type="password" className="form-control" placeholder="Contraseña"/>
        </div>
        <button disabled={this.state.boton} onClick={this.sendUser} type="submit" className="btn btn-primary">Enviar</button>
        <hr/>
        <h6>Si aún no estás registrado <Link to="/signup">Regístrate</Link></h6>
        <hr/>
       </form>
       <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLEID}
          buttonText="Ingresa con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogleLogin"
        />
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
         Si aún no estas registrado da clic en Regístrate.
        </Dialog>  

        </div>  
     </div>
     
    );
  }
}

export default Login;
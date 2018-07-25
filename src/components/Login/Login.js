import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { login } from '../../services/auth';
import { Link } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { googleUser } from '../../services/auth';
import './login.css'




class Login extends Component {

  state={
    newUser:{},
    user:{}
  }

  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newUser} = this.state;
    newUser[field] = value;
    this.setState({newUser}); 
  }
  sendUser = (e) => {
    e.preventDefault();
    login(this.state.newUser)
    .then(user=>{
      this.props.history.push(`/profile/${user._id}`);
    })
  }
  onFailure = (error) => {
    alert(error);
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
  };
  render() {
    return (
     <div className="login2">
      <Paper className="paper2" zDepth={5}>
       <form>
         <div className="form-group">
         <h3>Inicia Sesión</h3>

           <input onChange={this.onChange} name="correo" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Correo electrónico" />
           <small id="emailHelp" className="form-text text-muted">Tus datos estaran seguros con nosotros.</small>
         </div>
         <div className="form-group">
           <input onChange={this.onChange} name="password" type="password" className="form-control" placeholder="Contraseña"/>
        </div>
        <button onClick={this.sendUser} type="submit" className="btn btn-primary">Enviar</button>
        <hr/>
        <h6>Si aún no estás registrado <Link to="/">Regístrate</Link></h6>
        <hr/>
       </form>
       <div>
        <GoogleLogin
          clientId="853861088301-d6pp525e5fo1sbd9l1ebv0mogs158ofk.apps.googleusercontent.com"
          buttonText="Ingresa con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogle"
        />
        </div>         
      </Paper>
       
     </div>
    );
  }
}

export default Login;
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { login } from '../../services/auth';
import { Link } from 'react-router-dom';
import './login.css'




class Login extends Component {

  state={
    newUser:{}
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
       <button type="button" className="btn btn-danger">Ingresa con Google</button>
        </Paper>
       
     </div>
    );
  }
}

export default Login;
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {signup} from '../../services/auth';
import { Link } from 'react-router-dom';
import './signup.css'




class Signup extends Component {

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
    signup(this.state.newUser)
    .then(user=>{
      this.props.history.push(`/profile/${user._id}`);
    })
  }

  render() {
    return (
     <div className="login">
      <Paper className="paper" zDepth={5}>
       <form>
         <div className="form-group">
         <h3>Regístrate</h3>

           <input onChange={this.onChange} name="correo" type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Correo electrónico" />
           <small id="emailHelp" className="form-text text-muted">Tus datos estaran seguros con nosotros.</small>
         </div>
         <div className="form-group">
           <input onChange={this.onChange} name="password" type="password" className="form-control" placeholder="Contraseña"/>
        </div>
        <div className="form-group">
           <input onChange={this.onChange} name="password2" type="password" className="form-control"  placeholder="Repite tu contraseña"/>
        </div>
        <button onClick={this.sendUser} type="submit" className="btn btn-primary">Enviar</button>
        <hr/>
        <h6>Si ya estas registrado <Link to="/login">Inicia sesión</Link></h6>
        <hr/>
       </form>
       <button type="button" className="btn btn-danger">Ingresa con Google</button>
        </Paper>
       
     </div>
    );
  }
}

export default Signup;
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {signup} from '../../services/auth';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { GoogleLogin } from 'react-google-login';
import { googleUser } from '../../services/auth';
import './signup.css'




class Signup extends Component {

  state={
    newUser:{},
    user:{},
    boton:true,
    mensajeContraseñas:"",
    open:false
  }


  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newUser} = this.state;
    newUser[field] = value;
    if(newUser.correo.includes('@') && newUser.correo.includes('.') ){
      this.setState({boton:false})
    }
    else if(!newUser.correo.includes('@') || !newUser.correo.includes('.') ){
      this.setState({boton:true})
    }
    this.setState({newUser}); 
  }
  onChangeContraseñas = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    const {newUser} = this.state;
    let {mensajeContraseñas} = this.state;
    newUser[field] = value;
      if(newUser.password !== newUser.password2 ){
        mensajeContraseñas = "Tus contraseñas no coinciden..."
        this.setState({mensajeContraseñas,boton:true})
      }
      else if(newUser.password === newUser.password2 && newUser.password !== "" && newUser.password2 !== "" ){
        mensajeContraseñas = "Bien, tus contraseñas SI coinciden"
        this.setState({mensajeContraseñas,boton:false})
      }
    this.setState({newUser}); 
  }
  sendUser = (e) => {
    localStorage.setItem('userLogged', JSON.stringify(this.state.newUser))
    e.preventDefault();
    signup(this.state.newUser)
    .then(r=>{
      if(r.message){
        this.handleOpen()
      }
      else{
      this.props.history.push(`/profile/${r._id}`);
      }
    })
    .catch(e=>console.log(e))
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
  };
  handleOpen = () => {
    this.setState({open: true});
  };
  handleClose = () => {
    this.setState({open: false});
  };
  render() {
    const {mensajeContraseñas} = this.state;
    return (
      <div className="app">
      <div className="paper2">
        <Paper>
          <img className="imgLogin" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed" alt="Loguito"/>
        <br/>
        <h3>Regístrate</h3>
        <TextField
          hintText="Correo electrónico"
          floatingLabelText="Correo electrónico"
          name="correo"
          onChange={this.onChange}
        />
        <br/>
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password"
          onChange={this.onChangeContraseñas}
        />
        <br/>
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password2"
          onChange={this.onChangeContraseñas}
        />
        <div>
          <b style={mensajeContraseñas === "Bien, tus contraseñas SI coinciden" ? {color:'green'} : {color:'red'}} className="msjContraseñas">{mensajeContraseñas}</b>
        </div>
        <div className="hijoPaper">
        <br/>
        <RaisedButton 
        onClick={this.sendUser} 
        label="ENVIAR" 
        backgroundColor="#0D47A1" 
        labelColor="#FAFAFA" 
        className="botonIngresar"
        disabled={this.state.boton} 
        />
        <hr/>
        <h5 className="registrate">Si ya estás registrado <Link to="/" className="linkReg">Inicia Sesión</Link></h5>
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
      {/* <div className="login">
      <Paper className="paper" zDepth={5}>
       <form>
         <div className="form-group">
         <h3>Regístrate</h3>

           <input 
           onChange={this.onChange}  
           name="correo" 
           type="email" 
           className="form-control" 
           id="exampleInputEmail1" 
           aria-describedby="emailHelp" 
           placeholder="Correo electrónico" 
           />
           <small id="emailHelp" className="form-text text-muted">Tus datos estarán seguros con nosotros.</small>
         </div>
         <div className="form-group">
           <input 
           onChange={this.onChangeContraseñas}  
           name="password" 
           type="password" 
           className="form-control" 
           placeholder="Contraseña"
           />
        </div>
        <div className="form-group">
           <input 
           onChange={this.onChangeContraseñas} 
           name="password2" 
           type="password" 
           className="form-control marginInput"  
           placeholder="Repite tu contraseña"
           />
        </div>
        <div>
          <b style={mensajeContraseñas === "Bien, tus contraseñas SI coinciden" ? {color:'green'} : {color:'red'}} className="msjContraseñas">{mensajeContraseñas}</b>
        </div>
        <button disabled={this.state.boton} onClick={this.sendUser} type="submit" className="btn btn-primary">Enviar</button>
        <hr/>
        <h6>Si ya estás registrado <Link to="/">Inicia sesión</Link></h6>
        <hr/>
       </form>
       <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLEID}
          buttonText="Ingresa con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogle"
        />
        </div>       
      </Paper>
       
     </div> */}
     <div >
        <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}      
        > 
         Ups, algo salió mal, parece ser que el correo que quieres registrar ya ha sido utilizado en el pasado. <br/><br/>
         Te recomendamos usar otro correo electrónico.
        </Dialog>  

        </div> 
      </div>
     
    );
  }
}

export default Signup;
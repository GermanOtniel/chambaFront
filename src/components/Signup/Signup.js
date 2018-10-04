import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import {signup} from '../../services/auth';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { GoogleLogin } from 'react-google-login';
import { googleUser } from '../../services/auth';
import './signup.css'




class Signup extends Component {

  state={
    newUser:{},
    user:{},
    botonEnviar:true,
    botonGoogle:true,
    mensajeContraseñas:"",
    open:false
  }

  // guardar la info QUE EL USUARIO QUE QUIERE REGISTRARSE ESTA INGRESANDO
  onChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    let {newUser} = this.state;
    newUser[field] = value;
    if(newUser.terminosCondiciones === 'true'){
      this.setState({botonGoogle:false}) 
    }
    else if(newUser.terminosCondiciones !== 'true'){
      this.setState({botonGoogle:true}) 
    }
    if(newUser.correo !== undefined){
      if(newUser.terminosCondiciones === 'true' && newUser.correo.includes('@') && newUser.correo.includes('.')){
        this.setState({botonEnviar:false}) 
      }
      else if(newUser.terminosCondiciones !== 'true' && !newUser.correo.includes('@') && !newUser.correo.includes('.')){
        this.setState({botonEnviar:true}) 
      }
    }
    this.setState({newUser}); 
  }

  // REVISAR SI LAS CONTRASEÑAS SON IDENTICAS O IGUALES
  onChangeContraseñas = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    let {newUser,mensajeContraseñas} = this.state;
    newUser[field] = value;
      if(newUser.password !== newUser.password2 ){
        mensajeContraseñas = "Tus contraseñas no coinciden..."
        this.setState({mensajeContraseñas})
      }
      else if(newUser.password === newUser.password2 && newUser.password !== "" && newUser.password2 !== "" ){
        mensajeContraseñas = "Bien, tus contraseñas SI coinciden"
        this.setState({mensajeContraseñas})
      }

    this.setState({newUser}); 
  }

  // SE ENVIAN LOS DATOS DE REGISTRO PARA CREAR UN NUEVO USUARIO, SI YA HAY UN USUARIO CREADO  
  // CON ESE CORREO SE LE DICE QUE NEEE Q YA HAY UN USUARIO GUARDADO CON ESE CORREO
  sendUser = (e) => {
    localStorage.setItem('userLogged', JSON.stringify(this.state.newUser))
    let { newUser } = this.state;
    if(newUser.correo !== undefined){
      if(newUser.correo.includes('@') && newUser.correo.includes('.')){
        newUser.correo = newUser.correo.toLowerCase()
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
      else{
        this.handleOpen()
      }
    }
    else{
      this.handleOpen()
    }
  }

  // ES POR SI HAY ALGUN ERROR CON LA AUTENTICACION POR MEDIO DE GOOGLE
  onFailure = (error) => {
    console.log(error);
  };

  // PARA SACAR LOS DATOS DEL CACHE DEL USUARIO QUE ESTA INTENTANDO REGISTRARSE CON GOOGLE
  // CUANDO SE TIENEN LOS DATOS SE MANDAN AL BACKEND PARA QUE PROCEDA CON EL REGISTRO Y CREACION DE UN USUARIO NUEVO
  googleResponse = (response) => {
      const {user,newUser} = this.state;
      user.nombreUsuario = response.profileObj.name;
      user.correo = response.profileObj.email;
      user.googleId = response.profileObj.googleId
      user.terminosCondiciones = newUser.terminosCondiciones;
      this.setState({user});
      googleUser(this.state.user)
          .then(user=>{
          this.props.history.push(`/profile/${user._id}`);
      })
  };

  // ABRIR Y CERRAR DIALOGOS 
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
        <h3>Regístrate</h3>
        <TextField
          hintText="Correo electrónico"
          floatingLabelText="Correo electrónico"
          name="correo"
          onChange={this.onChange}
        />
        <TextField
          hintText="Tu contraseña"
          floatingLabelText="Tu contraseña"
          type="Password"
          name="password"
          onChange={this.onChangeContraseñas}
        />
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
        <RaisedButton 
        onClick={this.sendUser} 
        label="ENVIAR" 
        backgroundColor="#0D47A1" 
        labelColor="#FAFAFA" 
        className="botonIngresar"
        disabled={this.state.botonEnviar} 
        />
        <br/><br/>
        <div>
          <div style={{display:'flex',justifyContent:'center'}} >
          <RadioButtonGroup onChange={this.onChange} name="terminosCondiciones" defaultSelected="not_light">
          <RadioButton
            value={true}
          />
        </RadioButtonGroup>
        <b style={{fontSize:'12px',marginTop:'3px'}}>Acepto <a href="http://bit.ly/unocincoprivacidad">Términos y Condiciones</a></b>
        </div>
        </div>
 
        <hr/>
        <h5 className="registrate">Si ya estás registrado <Link to="/" className="linkReg">Inicia Sesión</Link></h5>
        <div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLEID}
          buttonText="Regístrate con Google"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="botonGoogleLogin"
          disabled={this.state.botonGoogle} 
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
         Ups, algo salió mal, parece ser que el correo que quieres registrar ya ha sido utilizado en el pasado ó no es válido. <br/><br/>
         Te recomendamos revisar el correo electrónico que estas ingresando.
        </Dialog>  

        </div> 
      </div>
     
    );
  }
}

export default Signup;
import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {changePassword} from '../../services/auth';
import { Link } from 'react-router-dom';
import './profile.css';


class TabSup extends Component{

  state={
    open:false,
    open2:false,
    cambios:{},
    passwordIncorrecta:true,
    passwordCoinciden:true,
    usuarioGmail:false,
    passwordd:"",
    correoo:""
  }

  componentWillMount(){
    const userLogged = `${JSON.parse(localStorage.getItem('userLogged'))}`;
    if(userLogged !== "null"){
      const correo = `${JSON.parse(localStorage.getItem('userLogged')).correo}`;
      const password = `${JSON.parse(localStorage.getItem('userLogged')).password}`;
      this.setState({usuarioGmail:false,passwordd:password,correoo:correo})
    }
    else if(userLogged === "null"){
      this.setState({usuarioGmail:true})
    }
  }

  onChange = (e) => {
    let {passwordd} = this.state;
    const field = e.target.name;
    const value = e.target.value;
    const {cambios} = this.state;
    cambios[field] = value;
    if (e.target.name === "passwordAntigua"){
      if(cambios.passwordAntigua !== passwordd){
        //console.log('No es correcta')
        this.setState({passwordIncorrecta:false})
      }
      else if(cambios.passwordAntigua === passwordd){
        //console.log('Si es correcta')
        this.setState({passwordIncorrecta:true})
      }
    }
   else if (e.target.name === "passwordNew2" || e.target.name === "passwordNew"){
    if(cambios.passwordNew !== cambios.passwordNew2){
      //console.log('No es correcta')
      this.setState({passwordCoinciden:false})
    }
    else if(cambios.passwordNew === cambios.passwordNew2){
      //console.log('Si es correcta')
      this.setState({passwordCoinciden:true})
    }
   }
   
    this.setState({cambios}); 
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  handleOpen = () => {
    this.setState({open2: true});
  };
  handleClose = () => {
    this.setState({open2: false});
  };

  changePassword = () =>{
    this.handleOpen()
  }
  sendNewPassword =()=>{
    let {correoo,cambios} = this.state;
    let body = {
      correo:correoo,
      newPasswordString:cambios.passwordNew
    }
    changePassword(body)
    .then(r=>{
      this.handleClose()
    })
    .catch(e=>console.log(e))
  }
  render(){
    const actions2 = [
      <FlatButton
        label="Enviar cambios"
        primary={true}
        keyboardFocused={true}
        onClick={this.sendNewPassword}
        disabled={!this.state.passwordIncorrecta}
      />,
      <FlatButton
        label="Cancelar"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    const {passwordIncorrecta,passwordCoinciden,usuarioGmail} = this.state;
      return (
        <div>
      <Tabs
      tabItemContainerStyle={{background: '#bc960b'}} 
      inkBarStyle={{background:'#546E7A'}}
      //#bc960b
      >
      <Tab
        icon={<FontIcon className="material-icons">home</FontIcon>}
        label="Perfil"
        containerElement={<Link to={`/profile/${JSON.parse(localStorage.getItem('user'))._id}`}/>}
      />
      <Tab
        icon={<FontIcon className="material-icons">notification_important</FontIcon>}
        label="Dinámicas"
        containerElement={<Link to="/dinamicas"/>}
      />
      {/* <Tab
        icon={<FontIcon className="material-icons">store_mall_directory</FontIcon>}
        label="Market"
        containerElement={<Link to="/menu"/>}
      /> */}
      <Tab
        icon={<FontIcon className="material-icons">menu</FontIcon>}
        label="Menu"
        onActive={this.handleToggle}
      />
    </Tabs>
    <div>
   
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
            openSecondary={true}
          >
            <div>
            <div className="logoMenu"> 
            <div>
              <img alt="Logo 1.5" width="150px" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed"/>
            </div>
            </div> 
          <div > 
            <div>
            <Link to="/ventas"><RaisedButton style={{height:50,marginTop:10}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="MIS VENTAS" fullWidth={true}></RaisedButton></Link>
            </div>
          </div> 
          {/* <div className="menu-container"> 
            <div>
            <Link to="/dinamicas"><RaisedButton style={{height:50}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="TICKETS" fullWidth={true}></RaisedButton></Link>
            </div>
          </div>
          */} 
          <div > 
            <div>
            <Link to="/mensajes"><RaisedButton style={{height:50,marginTop:10}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="BUZÓN" fullWidth={true} ></RaisedButton></Link>
            </div>
          </div> 
          <div > 
            <div>
            <Link to="/evidencias"><RaisedButton style={{height:50,marginTop:10}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="ENVIADAS" fullWidth={true} ></RaisedButton></Link>
            </div>
          </div>  
          <div > 
            <div>
            <RaisedButton href="https://15onzas.teachable.com/" style={{height:50,marginTop:10}} labelColor="#FAFAFA"	 backgroundColor="#546E7A" label="ACADEMIA 1.5" fullWidth={true} ></RaisedButton>
            </div> 
          </div> 
          <div > 
            <div>
            <RaisedButton onClick={this.changePassword} style={usuarioGmail ? {display:"none"} : {height:50,marginTop:10}} labelColor="#FAFAFA"	 backgroundColor="#546E7A" label="CAMBIAR CONTRASEÑA" fullWidth={true} ></RaisedButton>
            </div> 
          </div> 
          </div>
          </Drawer>
          </div>
          <div>
          <Dialog
          title="Cambia tu contraseña"
          modal={false}
          actions={actions2}
          open={this.state.open2}
          onRequestClose={this.handleClose}
        >
        <b>Si tu te logueas con Google(Gmail), esta función no es para ti.</b>
        <TextField
          hintText="Contraseña actual"
          floatingLabelText="Contraseña actual"
          type="Password"
          name="passwordAntigua"
          onChange={this.onChange}
        />
         <div>
          <b style={passwordIncorrecta ? {color:'green'} : {color:'red'}} className="msjContraseñas">{passwordIncorrecta ? "" : "La contraseña que estas ingresando es incorrecta"}</b>
        </div>
         <TextField
          hintText="Nueva contraseña"
          floatingLabelText="Nueva contraseña"
          type="Password"
          name="passwordNew"
          onChange={this.onChange}
        />
         <TextField
          hintText="Repite tu nueva contraseña"
          floatingLabelText="Repite tu nueva contraseña"
          type="Password"
          name="passwordNew2"
          onChange={this.onChange}
        />
        <div>
          <b style={passwordCoinciden ? {color:'green'} : {color:'red'}} className="msjContraseñas">{passwordCoinciden ? "" : "Las contraseñas no coinciden"}</b>
        </div>
        </Dialog>
          </div>
    </div>
      );
    }
    
  }
  

export default TabSup;




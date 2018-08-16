import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Link} from 'react-router-dom';
import { getDinamics } from '../../services/dinamicas';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  gridList: {
    width: '100%',
    overflowY: 'auto',
  },
};

class Dinamica extends Component{

  state={
   dinamics:[],
   centro:false,
   open:true
  }
  componentWillMount(){
    let {centro} = this.state;
    let userCentro = `${JSON.parse(localStorage.getItem('user')).centroConsumo}`;
    let userCenter;
    if( userCentro === "undefined" ) {
      userCenter = "No hay centro"
      centro = true
      this.setState({centro})
    }
    else if (userCentro !== "undefined"){
      userCenter = userCentro
      centro = false
      getDinamics(userCenter)
      .then(dinamics=>{
        this.setState({dinamics,centro})
      })
      .catch(e=>alert(e))
    }  
 }
 handleClose = () => {
  this.setState({centro: false});
  //this.props.history.push("/dinamicas");
};


  render(){
    const {dinamics,centro} = this.state;
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
      return (
        <div>
          <div>
          <TabSup />
          </div>
          <div>
          <Dialog
          title="¡Actualiza tu Perfil!"
          actions={actions}
          modal={false}
          open={this.state.centro}
          onRequestClose={this.handleClose}
        >
          Para saber que Dinámicas corresponden a tu Centro de Consumo necesitamos saber en que Centro de Consumo trabajas,
          por favor regresa a tu Perfil y actualízalo.
          <br/><br/>
          <b>Una vez que lo hayas hecho sal de la aplicación y vuelve a <big>Ingresar</big> con tu correo y contraseña o en su defecto con tu cuenta de 
          Google.</b>
        </Dialog>
          </div> 
        <div style={styles.root}>
          <GridList
      cellHeight={180}
      style={styles.gridList}
    >
      {dinamics.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio)).map((dinamic) => (
        <GridTile
          key={dinamic.imagenPremio}
          title={dinamic.nombreDinamica}
          subtitle={<b>{dinamic.fechaInicio.slice(0,10)} <br/>Modalidad:  {dinamic.modalidad}</b>}
          actionIcon={<Link to={`/dinamica/${dinamic._id}`} ><IconButton><FontIcon color="white" className="material-icons">pageview</FontIcon></IconButton></Link>}
        >
          <img alt="Imagen Premio Dinámica" src={dinamic.imagenPremio} />
        </GridTile>
      ))}
    </GridList>
        </div>
          
        </div>
      );
    }
    
  }
  

export default Dinamica;

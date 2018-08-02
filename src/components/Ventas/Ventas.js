import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { getVentas } from '../../services/ventas';
import { sendWinner } from '../../services/dinamicas'
import './ventas.css';




class Ventas extends Component{

  state={
    ventas:[],
    newArray:[],
    newArray2:[],
    open: false
  }

  componentWillMount(){
    const user = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getVentas(user)
    .then(ventas=>{
      
      //console.log(ventas)
//DINAMICAS EN LAS QUE EL USUARIO TIENE VENTAS APROBADAS 
      let dinamicasArray = ventas.map(venta=>venta.dinamica);
// DONDE VOY A GUARDAR LAS DINAMICAS QUE YA NO SE REPITEN
      var {newArray} = this.state;
      // NO SE QUE HACE PERO ES NECESARIO
      var lookupObject  = {};
// EL CICLO QUE RECORRE EL ARRAY ORIGINAL DE DINAMICAS EN LA CUAL AUN HAY REPETIDAS
      for(var i in dinamicasArray) {
        lookupObject[dinamicasArray[i]['_id']] = dinamicasArray[i];
      }
// EL CICLO QUE PUSHEA AL OBJETO DONDE SE GUARDAN LAS DINAMICAS NO REPETIDAS
      for(i in lookupObject) {
         newArray.push(lookupObject[i]);
      }
      
//EL CICLO QUE RECORRE EL ARRAY DE DINAMICAS NO REPETIDAS
// Y EL CICLO QUE RECORRE EL ARRAY DE VENTAS 
// Y LA COMPARACION DE SI TIENEN EL MISMO ID DE DINAMICA QUE LE SUME LA CANTIDAD
// Y EL RESULTADO SEA LAS VENTAS TOTALES DE LA DINAMICA CORRESPONDIENTE
      for(var i = 0; i<newArray.length;i++){
        for(var j = 0; j<ventas.length;j++){
          if( newArray[i]._id === ventas[j].dinamica._id ){
            for(let k = 0; k < ventas[j].marcas.length; k++){
              newArray[i].ventas.push(ventas[j].marcas[k])
            }
          }
        }
      }
      for(let f = 0; f < newArray.length; f++){
        //console.log('MARCAPUNTOSVENTAS: ',newArray[f].marcaPuntosVentas)
        for( let b = 0; b < newArray[f].marcaPuntosVentas.length; b++){
                  //console.log('IDS MARCAS PARTICIPANTES: ',newArray[f].marcaPuntosVentas[b]._id)
          for(let n = 0; n < newArray[f].ventas.length; n++){
            //console.log('IDS MARCAS VENDIDAS X USUARIO: ', newArray[f].ventas[n]._id._id)
            if(newArray[f].marcaPuntosVentas[b]._id === newArray[f].ventas[n]._id._id){
              newArray[f].marcaPuntosVentas[b].puntosUsuario += newArray[f].ventas[n].ventas
              newArray[f].marcaPuntosVentas[b].nombre = newArray[f].ventas[n]._id.nombre
            }
          }
        }
        //console.log('VENTAS:',newArray[f].ventas)
      }
      //console.log(newArray.map(dinamica=>dinamica.marcaPuntosVentas))
      let newArray2 = newArray.map(dinamica=>dinamica.marcaPuntosVentas); 
      //console.log(newArray2)
        console.log(newArray)
      this.setState({newArray,newArray2})
    })
    .catch(e=>console.log(e))
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.history.push("/menu");
  };
  oneWinner = (dinamic) => {
    let idDinamica = dinamic._id;
    dinamic.winner = `${JSON.parse(localStorage.getItem('user'))._id}`;
    sendWinner(dinamic,idDinamica)
    .then(dinamic=>{
      console.log(dinamic)
      this.setState({open:true})
    })
    .catch(e=>console.log(e))
  } 

  render(){
    const actions = [
      <FlatButton
        label="Entendido"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
    ];
    const { newArray, newArray2 } = this.state;
      return (
        <div>
          <div>
          <TabSup />
          </div>
          <div>
          {newArray.map((dinamic)=>(
            <div key={dinamic._id} className="bloques">
              <hr className="hrVentas"/>
              <h4>Dinamica: {dinamic.nombreDinamica}</h4>
              <h6>Puntaje: </h6> {dinamic.marcaPuntosVentas.map((marca)=>(
                <div className="ventas" key={marca._id}>
                <p>Marca: {marca.nombre}</p>  <span>Meta de Ventas:</span> <big>{marca.puntosVentas}</big><br/>
                <b>Ventas Logradas: {marca.puntosUsuario}</b>
                {marca.puntosUsuario >= marca.puntosVentas ? dinamic.ganador = true : dinamic.ganador = false}
                </div>
              ))}
              <div className="buttonVentas">
              <button style={dinamic.ganador === true ? {display:"block"} : {display:"none"} } onClick={() => this.oneWinner(dinamic)}>Reclamar premio</button>
              </div>
          </div>
          ))} 
          </div>
          <div>
          <Dialog
          title="¡GANASTE!"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          ¡¡¡Felicidades!!! Eres un GANADOR de esta dinámica, en breve se comunicaran contigo via 
          correo electrónico para la entrega de tu PREMIO.
        </Dialog>
          </div>
          
        </div>
      );
    }
    
  }
  

export default Ventas;

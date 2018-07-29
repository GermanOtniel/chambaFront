import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { getVentas } from '../../services/ventas';
import { sendWinner } from '../../services/dinamicas'
import './ventas.css';




class Ventas extends Component{

  state={
    ventas:[],
    newArray:[]
  }

  componentWillMount(){
    const user = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getVentas(user)
    .then(ventas=>{
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
            newArray[i].ventasTotales = newArray[i].ventasTotales + ventas[j].cantidad;
          }
        }
      }
      this.setState({newArray})
      //console.log(this.state.newArray)
    })
    .catch(e=>console.log(e))
  }

  oneWinner = (dinamic) => {
    let idDinamica = dinamic._id;
    dinamic.ganador = `${JSON.parse(localStorage.getItem('user'))._id}`;
    sendWinner(dinamic,idDinamica)
    .then(dinamic=>{
      console.log(dinamic)
    })
    .catch(e=>console.log(e))
  } 

  render(){
    const { newArray } = this.state;
      return (
        <div>
          <div>
          <TabSup />
          </div>
          {newArray.map((dinamic)=>(
            <div key={dinamic._id} className="bloques">
              <h6>Nombre de Dinamica: {dinamic.nombreDinamica}</h6>
              <h6>Ventas totales: {dinamic.ventasTotales}</h6>
              <h6>Meta: {dinamic.meta}</h6>
              <button style={dinamic.ventasTotales >= dinamic.meta ? {display:"block"} : {display:"none"} } onClick={() => this.oneWinner(dinamic)}>Reclamar Premio</button>
          </div>
          ))}
        </div>
      );
    }
    
  }
  

export default Ventas;

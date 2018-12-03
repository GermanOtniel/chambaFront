import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { getNotas } from '../../services/notas';
import './notas.css';


let styleButton = {
  color:'white'
}

class Notas extends Component{

  state={
    notas:[],
    puntos:[],
    open:false,
    nota:{}
  }
// ESTE COMPONENTE TRAE LAS NOTAS O MENSAJES QUE SE HAN CREADO, HAY DOS TIPOS DE MENSAJES, LOS GLOBALES Y LOS QUE SE CREAN CUANDO UNA
// EVIDENCIA HA SIDO RECHAZADA, CUANDO SE CARGA EL COMPONENTE TRAEMOS LAS NOTAS QUE HAN SIDO CREADAS PARA ESE USUARIO Y LAS GLOBALES, CREO.
// NO ESTOY SEGURO SI TAMBIEN SE REPRESENTAN LAS GLOBALES
  componentWillMount(){
    let {notas} = this.state;
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getNotas(id)
    .then(nota=>{
      notas = nota.map(nota=>nota)
      for (let i = 0; i < notas.length; i++){
        if(notas[i].todos === true){
          notas[i].created = notas[i].created_at.slice(0,10)
        }
        else{
          notas[i].din = notas[i].dinamica.nombreDinamica
          notas[i].pic = notas[i].dinamica.imagenPremio
          notas[i].pic2 = notas[i].evidenciaPertenece.archivo
          notas[i].idd = notas[i].dinamica._id
          notas[i].created = notas[i].created_at.slice(0,10)
        }
      }
      notas.sort((a, b) => new Date(b.created) - new Date(a.created))
      this.setState({notas})
    })
    .catch(e=>console.log)
 }

 // ABRIR Y CERRAR DIALOGOS INFORMATIVOS
handleOpen = () => {
  this.setState({open: true});
};
handleClose = () => {
  this.setState({open: false});
};

// ABRIR UN MENSAJE O NOTA EN ESPECIFICO CUANDO S ELE DA CLIC A UN MENSAJE
oneMessage = (nota) => {
  this.setState({nota})
  this.handleOpen()
};

// SI EL USUARIO DA CLIC EN EL NOMBRE D ELA DINAMICA PUEDE IR A ESA DINAMICA
goToDinamic = (nota) => {
  this.props.history.push(`/dinamica/${nota.idd}`)
};
// SI ES UN MENSAJE GLOBAL SI DA CLIC EN DONDE DEBERIA DE IR EL NOMBRE DE LA DINAMICA
// PUES TE LLEVA AL MENU GENERAL DE LAS DINAMICAS
goToMenu = () => {
  this.props.history.push(`/dinamicas`)
};
  // IR A EDITAR UNA EVIDENCIA
  goToEditEvidence=()=>{
    let {nota} = this.state;
    this.props.history.push(`/editevidence/${nota.evidenciaPertenece._id}`)
  }

  render(){
    const {notas,nota} = this.state;
    const actions = [
      <FlatButton 
      onClick={this.goToEditEvidence}  
      label="Editar" 
      primary={true}
    />,
    <FlatButton 
    onClick={this.handleClose}  
    label="Cerrar" 
    primary={true}
  />
    ]
      return (
        <div>
          <div>
          <TabSup />
          </div>
          <div className="padreProfile">
          <div className="h5EnviarEvi">
          <FontIcon className="material-icons">sentiment_very_dissatisfied</FontIcon>
          <h4>Evidencias Rechazadas</h4>
          </div>
          <hr/>
          {notas.map((nota)=>(
            <div  key={nota._id}>
            <Paper>
              <h6 onClick={nota.todos ? ()=>this.goToMenu() : ()=>this.goToDinamic(nota)}>{nota.todos ? "Hay un nuevo mensaje global" : "Se ha rechazado una de tus evidencias"}</h6>
              <img alt="Imagen Nota" width="150" src={nota.pic ? nota.pic : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1" } />
              <br/>
              <FlatButton
                style={styleButton}
                label="Ver Mensaje"
                backgroundColor="#546E7A"
                onClick={() => this.oneMessage(nota)}
                disableTouchRipple={true}
              />
            </Paper>
            <hr/>
            </div>
              
          ))} 
          </div>
          <div>
          <Dialog
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
          className="padreProfile"
          actions={actions}
        > 
          <h6>{nota.todos ? "Mensaje Global" : "Mensaje de la dinamica " + nota.din}</h6>
          <hr/>
          <b>Mensaje: </b>
          <span>{nota.cuerpo}</span>
          <br/>
          <img alt="Imagen Nota" width="230" height="200" src={nota.pic2 ? nota.pic2 : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1"}/>
          <span className="fechaEvidenciaRechazada">{nota.created}</span>
        </Dialog>
          </div>

        </div>
      );
    }
    
  }
  

export default Notas;

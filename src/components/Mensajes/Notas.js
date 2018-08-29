import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
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

  componentWillMount(){
    let {notas} = this.state;
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
    getNotas(id)
    .then(nota=>{
      notas = nota.map(nota=>nota)
      for (let i = 0; i < notas.length; i++){
        notas[i].din = notas[i].dinamica.nombreDinamica
        notas[i].pic = notas[i].dinamica.imagenPremio
        notas[i].pic2 = notas[i].evidenciaPertenece.archivo
        notas[i].idd = notas[i].dinamica._id
        notas[i].created = notas[i].created_at.slice(0,10)
      }
      notas.sort((a, b) => new Date(b.created) - new Date(a.created))
      this.setState({notas})
    })
    .catch(e=>console.log)
 }
 handleOpen = () => {
  this.setState({open: true});
};

handleClose = () => {
  this.setState({open: false});
};
 oneMessage = (nota) => {
   this.setState({nota})
   this.handleOpen()
 }
 goToDinamic = (nota) => {
  this.props.history.push(`/dinamica/${nota.idd}`)
}
  render(){
    const {notas,nota} = this.state;
      return (
        <div>
          <div>
          <TabSup />
          </div>
          <div className="padreProfile">
            <span className="mensajes">Mensajes</span>
          </div>

          <div className="padreProfile">
          {notas.map((nota)=>(
            <div  key={nota._id}>
            <Paper>
              <h6 onClick={()=>this.goToDinamic(nota)}>La dinámica <b>{nota.din}</b> ha rechazado una de tus evidencias</h6>
              <img alt="Imagen Nota" width="150" src={nota.pic} />
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
        > 
          <h6>{"Mensaje de la dinamica " + nota.din}</h6>
          <hr/>
          <span>{nota.cuerpo}</span>
          <br/>
          <img alt="Imagen Nota" width="230" height="200" src={nota.pic2 ? nota.pic2 : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Flogo15.jpg?alt=media&token=126df777-ff3c-4587-9188-0e4052b5cde1"}/>
          <span className="fechaEvidenciaRechazada">{"Enviaste esta evidencia el "+nota.created}</span>
        </Dialog>
          </div>

        </div>
      );
    }
    
  }
  

export default Notas;

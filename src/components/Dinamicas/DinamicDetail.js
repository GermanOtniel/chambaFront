import React, {Component} from 'react';
import { getSingleDinamic } from '../../services/dinamicas';
import { getEvidencesByDinamic } from '../../services/evidencias';
import TabSup from '../Profile/TabSup';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import './dinamica.css';

const styles = {
  noRoot:{
    display:'none'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  titleStyle: {
    color: 'white',
  },
  radioButton: {
    marginTop: 16,
  }
};


const label = {
  color:'white'
}


class DinamicDetail extends Component{

  state={
    dinamic:{},
    open2:false,
    fotito:"",
    file:{},
    marcas:[],
    marcaDetalle:{},
    boton:true,
    faltaImagen:true,
    open3:false,
    open4:false,
    newCreadores:[],
    verRanking: false,
    puntos:0
  }

  // AQUI SE TRAEN LOS DETALLES DE UNA DINAMICA, PERO TAMBIEN SE TRAEN LAS EVIDENCIAS QUE HA GENERADO ESA DINAMICA
  // Y SE ORDENAN POR USUARIO QUE LAS HA CREADO, SE HACE UNA OPERACION MATEMATICA PARA ASIGNAR VENTAS TOTALES O PUNTOS
  // SEGUN CORRESPONDA EL CASO
  componentWillMount(){
    let id = this.props.match.params.id
    let idUser = `${JSON.parse(localStorage.getItem('user'))._id}`;
    let {puntos} = this.state;
    this.setState({id})
   getSingleDinamic(id)
   .then(dinamic=>{
     let marcas = dinamic.marcaPuntosVentas.map(marca=> marca);
     let chipData = marcas
     dinamic.fechaI = dinamic.fechaInicio.slice(0,10)
     dinamic.fechaF = dinamic.fechaFin.slice(0,10)
     getEvidencesByDinamic(id)
     .then(evidencias=>{
       // TRAEMOS TODAS LAS EVIDENCIAS QUE HA GENERADO UNA DINAMICA

       // LOS CREADORES DE LAS EVIDENCIAS LOS GUARDAMOS EN creadoresArray
       let creadoresArray = evidencias.map(evidencia=>evidencia.creador)
       // newCreadores SERA EL ARRAY DONDE GUARDAREMOS LOS CREADORES DE LAS EVIDENCIAS PERO EN DONDE NO SE REPITEN
        var {newCreadores} = this.state;
        // SIGUE SIENDO UNA DUDA QUE HACE lookupObject PERO ES NECESARIO
        var lookupObject  = {};
        for(var iii in creadoresArray) {
          lookupObject[creadoresArray[iii]['_id']] = creadoresArray[iii];
        }
        for(iii in lookupObject) {
          newCreadores.push(lookupObject[iii]);
       }
       // HASTA AQUI TENEMOS EN newCreadores LOS USUARIOS SIN REPETIRSE QUE HAN MANDADO EVIDENCIAS EN ESTA DINAMICA
       
       // AQUI VAMOS A AGRUPAR LAS EVIDENCIAS POR USUARIO
       for(var i = 0; i<newCreadores.length;i++){
        for(var j = 0; j<evidencias.length;j++){
          if( newCreadores[i]._id === evidencias[j].creador._id ){
            for ( let o = 0; o < evidencias[j].marcas.length; o++){
              evidencias[j].marcas[o].id = evidencias[j].marcas[o]._id._id;
              newCreadores[i].ventasDinamica.push(evidencias[j].marcas[o]);
            }
          }
        }
      }

      //AQUI SE LE INSERTAN LAS MARCAS QUE DEBE DE VENDER CADA USUARIO, SE USA UN CICLO PARECIDO A CUANDO QUEREMOS DEJAR
      // LOS USUARIOS SIN REPETIRSE QUE HAN MANDADO EVIDENCIAS, PORQUE NECESITAMOS TENER EN UN ATRIBUTO DE MI USUARIO TANTO
      // LAS MARCAS Y LOS PUNTOS QUE DA CADA MARCA, COMO LAS VENTAS QUE HA HECHO DE CADA MARCA EL USUARIO PARA HACER
      // LAS OPERACIONES CORRESPONDIENTES DE VENTAS O PUNTOS.
      var lookupObject3  = {};
      for(let z = 0; z < newCreadores.length; z++){
        for(var ii in newCreadores[z].ventasDinamica) {
          lookupObject3[newCreadores[z].ventasDinamica[ii]['id']] = newCreadores[z].ventasDinamica[ii];
        }
        for(ii in lookupObject3) {
          newCreadores[z].marcas.push(lookupObject3[ii]);
       }
      }

      // AQUI SE AGRUPAN LAS VENTAS POR CADA MARCA EN CADA EVIDENCIA REALIZADA POR CADA USUARIO.
      // SI UN USUARIO REGISTRO EN UNA EVIDENCIA 10 DE COCA 10 DE FANTA Y 5 DE MANZANITA EN UNA EVIDENCIA 
      // PERO EN OTRA EVIDENCIA REGISTRO 3 DE COCA 2 DE FANTA Y 8 DE MANZANITA SE SUMAN LAS VENTAS POR MARCA CORRESPONDIENTE.
     for(let x = 0; x < newCreadores.length; x++){
       for (let v = 0; v < newCreadores[x].marcas.length; v++){
          for ( let y = 0; y < newCreadores[x].ventasDinamica.length; y++){
            if(newCreadores[x].marcas[v]._id._id === newCreadores[x].ventasDinamica[y]._id._id  ){
              newCreadores[x].marcas[v].puntosUsuario += newCreadores[x].ventasDinamica[y].ventas
              newCreadores[x].marcas[v].nombre = newCreadores[x].ventasDinamica[y]._id.nombre
            }
          }
      }
     }
     // AQUI SE HACE UN TOTAL DE VENTAS O UN TOTAL DE PUNTOS (DEPENDIENDO DE LA MODALIDAD DE LA DINAMICA) 
     // POR CADA USUARIO DEPENDIENDO LAS VENTAS TOTALES QUE REGISTRO
     for (let ab = 0; ab < newCreadores.length; ab++){
      if(dinamic.modalidad === "Ventas"){
        for (let cd = 0; cd < newCreadores[ab].marcas.length; cd++){
          newCreadores[ab].total += newCreadores[ab].marcas[cd].puntosUsuario
        }
     }
     else if (dinamic.modalidad === "Puntos"){
      for (let ef = 0; ef < newCreadores[ab].marcas.length; ef++){
        newCreadores[ab].total += newCreadores[ab].marcas[ef].puntosUsuario * newCreadores[ab].marcas[ef].puntosVentas
      }
     }
     // ESTE IF ES PARA REVISAR SI EN EL RANKING O LOS DATOS QUE HACEN POSIBLE EL RANKING ESTA EL USUARIO ACTUAL
     // SI SI ESTA QUIERO SABER CUANTOS PUNTOS O VENTAS EN TOTAL LLEVA EN ESTA DINÁMICA PARA A SU VEZ MOSTRARSELO AL USUARIO
     // EN EL CASO DE LAS VENTAS S EMUESTRA UN DETALLE MAS A FONDO EN LA SECCION MIS VENTAS
     if(newCreadores[ab]._id === idUser){
      puntos = newCreadores[ab].total
    }
    }
       this.setState({newCreadores,puntos})
     })
     .catch(e=>console.log(e))
     this.setState({dinamic,marcas,chipData})
   })
   .catch(e=>alert(e));
 }
  

// ABRIR Y CERRAR DIALOGOS INFORMATIVOS Y D ELA CREACION DE EVIDENCIAS
  handleOpen2 = () => {
    this.setState({open2: true});
  };
  handleClose2 = () => {
    this.setState({open2: false});
  };
  handleOpen3 = () => {
    this.setState({open3: true});
  };
  handleClose3 = () => {
    this.setState({open3: false});
  };
  handleOpen4 = () => {
    this.setState({open4: true});
  };
  handleClose4 = () => {
    this.setState({open4: false});
  };

  // LOS CHIPS QUE MUESTRAN LA MARCA QUE SE DEBE DE VENDER PUEDEN MOSTRAR MAS DETALLES ACERCA DE LA MARCA
  // ESTA FUNCION LOGRA ESO, MUESTRA EL DETALLE DE LA MARCA SELECCIONADA
  marca = (marca) => {
    let {marcaDetalle} = this.state;
    this.handleOpen2()
    marcaDetalle = marca._id
    marcaDetalle.descripcion = marca.descripcion
    this.setState({marcaDetalle})
  }
// MUESTRA ELRANKING DE LA DINAMICA
  verRanking = (e) =>{
    this.setState({verRanking:true})
  }
  // OCULTA EL RANKING DE LA DINAMICA
  noVerRanking = (e) =>{
    this.setState({verRanking:false})
  }
// REFRESCA LA PAGINA, ESTO ES PORQUE NECESITAMOS BORRAR LOS DATOS INGRESADOS EN EL DIALOGO DE LA EVIDENCIA
// FUNCIONA PERO CREO QUE YA FUNCIONABA CON LO QUE HICE EN LA FUNCION DE HANDLECLOSE QUE HACIA QUE EL CHIPDATA.VENTAS SE IGUALARA A 0,
// PERO CUANDOHICE EL DEPLOY NO ME FUNCIONO, PERO CREO QUE FUE PORQUE SE JUNTO CON UN ERROR DEL DEPLOY, EN FIN AHORITA FUNCIONA ASI 
// PERO MAS ADELANTE SERIA BUENO QUITAR ESTE REFRESH
  refreshPage = () =>{
    this.handleClose3()
    window.location.reload()
  }
 
  goToSendEvidence = () =>{
    let {dinamic} = this.state;
    this.props.history.push(`/sendevi/${dinamic._id}`)
  }


  
  render(){
    const {dinamic, marcas,marcaDetalle,newCreadores,verRanking,puntos} = this.state;
    const actions2 = [
      <RaisedButton 
              onClick={this.refreshPage}  
              label="Ok" 
              backgroundColor="#B71C1C"
              labelColor="#FAFAFA"
            />
    ];
      return (
        <div>
          <TabSup />
          <Card>         
            <CardMedia
              overlay={<CardTitle 
              title={dinamic.nombreDinamica} 
              subtitle={<b className="bSubtitle"> {dinamic.fechaI + " - " + dinamic.fechaF}</b>} />}
            >
              <img 
                src={dinamic.imagenPremio} 
                alt="Referencia del premio" 
              />
            </CardMedia>
            <CardTitle
              subtitle="Modalidad de la Dinámica" 
              title={dinamic.modalidad} 
              
            />
            <h5 className="puntajePorDinamica">{dinamic.modalidad === "Ventas" ? 'Ventas: ' + puntos  : ' Puntos: ' + puntos}</h5>
            <hr/>
            <b>{dinamic.modalidad === "Ventas" ? "Ventas requeridas por marca: " : "Puntos por unidad vendida: "}</b>     
            <br/><br/>
            {marcas.map( (marca, index) => (
              <div onClick={()=>this.marca(marca)} key={index}>
              <Chip
              className="dinamicDetailHijo"
              >
              <Avatar src={marca._id.imagen} />
                {marca._id.nombre}
                 <b>{dinamic.modalidad === "Ventas" ? " " + marca.puntosVentas + " ventas" : " " + marca.puntosVentas + " puntos" }</b> 
              </Chip> 
              <br/><br/>
              </div>
              ))}
              <div style={verRanking ? styles.root : styles.noRoot}>
              <b>{newCreadores[0] ? "Ranking: " : ""}</b>
              <FlatButton 
                onClick={this.noVerRanking} 
                primary={true}
                label={newCreadores[0] ? "Ocultar" : "Aún no hay ranking :(" }
                labelStyle={styles.label2} 
              />
                <GridList style={styles.gridList} cols={1}>
                  {newCreadores.sort((a, b) => b.total - a.total ).map((creador,index) => (
                <GridTile
                  key={index}
                  title={dinamic.modalidad === "Ventas" ? creador.total +' ventas' : creador.total + ' puntos'}
                  subtitle={ creador.nombre && creador.apellido ? index+1 + ') ' + creador.nombre + " " + creador.apellido : index+1 + ') ' + creador.correo  }
                  titleStyle={styles.titleStyle}
                  // actionIcon={<IconButton onClick={() => this.detalleVenta(creador)} ><FontIcon color="white" className="material-icons">equalizer</FontIcon></IconButton>}
                  titleBackground="linear-gradient(to top, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                >
                  <img width="150px" alt="Foto Usuario" src={creador.fotoPerfil ? creador.fotoPerfil : "https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/users%2Fuser.png?alt=media&token=f699f557-33b4-44d2-9de5-442e791b746a"} />
                </GridTile>
                ))}
                </GridList>
            </div>
            <hr/>
              <b>Descripción de la Dinámica:</b>
            <CardText>
              {dinamic.descripcion}
            </CardText>
            <CardActions>
              <FlatButton 
                onClick={this.goToSendEvidence} 
                label="Participar" 
                fullWidth={false}  
                backgroundColor='#B71C1C' 
                labelStyle={label} 
                disableTouchRipple={true}
              />
              <FlatButton 
                onClick={this.verRanking} 
                label="Ver Ranking" 
                fullWidth={false}  
                backgroundColor='#004D40' 
                labelStyle={label} 
                disableTouchRipple={true}
              />
            </CardActions>  
          </Card>
        <div>
        <Dialog
          modal={false}
          open={this.state.open2}
          onRequestClose={this.handleClose2}
          autoScrollBodyContent={true}
        >
        <div className="padreProfile">
       <b>Información adicional de {marcaDetalle.nombre}</b>
       <hr/>
       {marcaDetalle.descripcion}
       <br/>
       <img alt="Foto Marca" width="100" height="90" src={marcaDetalle.imagen} />   
       </div>      
        </Dialog> 
        </div>
        <div>
        <Dialog
          modal={false}
          actions={actions2}
          open={this.state.open3}
          autoScrollBodyContent={true}
        >
        <div className="padreProfile">
              Tu evidencia ha sido creada satisfactoriamente, tan solo debes de 
              esperar a que esta sea Aprobada para asi asignarte tus ventas o puntos.
              <br/>
             
       </div>      
        </Dialog> 
        </div>
        <div>
        <Dialog
          modal={false}
          open={this.state.open4}
          onRequestClose={this.handleClose4}
          autoScrollBodyContent={true}
        >
              <div className="padreProfile">
              Parece que algo salió mal...asegurate de estar conectado a Internet e ¡Inténtalo de nuevo!
              </div>      
        </Dialog> 
        </div>
      </div>
      );
    }
    
  }

  

export default DinamicDetail;
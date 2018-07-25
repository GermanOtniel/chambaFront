import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
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
   dinamics:[]
  }
  componentWillMount(){
   getDinamics()
   .then(dinamics=>{
     this.setState({dinamics})
   })
   .catch(e=>alert(e))
 }

  render(){
    const {dinamics} = this.state;
      return (
        <div>
          <div>
          <TabSup />
          </div>
        <div style={styles.root}>
          <GridList
      cellHeight={180}
      style={styles.gridList}
    >
      {dinamics.map((dinamic) => (
        <GridTile
          key={dinamic.imagenPremio}
          title={dinamic.nombreDinamica}
          subtitle={<b>{dinamic.fechaInicio} <br/>Modalidad:  {dinamic.modalidad}</b>}
          actionIcon={<Link to={`/dinamica/${dinamic._id}`} ><IconButton><FontIcon color="white" className="material-icons">pageview</FontIcon></IconButton></Link>}
        >
          <img src={dinamic.imagenPremio} />
        </GridTile>
      ))}
    </GridList>
        </div>
          
        </div>
      );
    }
    
  }
  

export default Dinamica;

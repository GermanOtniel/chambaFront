import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import {getSingleUser} from '../../services/auth';
import './puntos.css';




class Puntos extends Component{

  state={
    user:{},
    puntos:[]
  }

  componentWillMount(){
    const id = `${JSON.parse(localStorage.getItem('user'))._id}`;
   getSingleUser(id)
   .then(user=>{
     let {puntos} = this.state;
     puntos.push(user.puntos)
     this.setState({user,puntos})
     console.log(this.state.puntos)
   })
   .catch(e=>console.log(e));
 }


  render(){
      return (
        <div>
          <div>
          <TabSup />
          </div>
             <h2>Puntos</h2>
        </div>
      );
    }
    
  }
  

export default Puntos;

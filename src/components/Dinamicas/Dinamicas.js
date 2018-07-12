import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';

class Dinamica extends Component{

  state={
   
  }

 

  render(){
    const {user} =this.state;

      return (
        <div className="padreProfile">
        <TabSup />
          <h4>Dinamicas</h4>
        </div>
      );
    }
    
  }
  

export default Dinamica;

import React, {Component} from 'react';
import TabSup from '../Profile/TabSup';
import {Link} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import './menu.css';




class Menu extends Component{

  state={}


  render(){
      return (
        <div>
          <div>
          <TabSup />
          </div>
          
          <div className="menu-container"> 
            <div>
            <Link to="/ventas"><RaisedButton style={{height:50}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="VENTAS" fullWidth={true}></RaisedButton></Link>
            </div>
          </div> 
          <div className="menu-container"> 
            <div>
            <Link to="/dinamicas"><RaisedButton style={{height:50}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="TICKETS" fullWidth={true}></RaisedButton></Link>
            </div>
          </div> 
          <div className="menu-container"> 
            <div>
            <Link to="/dinamicas"><RaisedButton style={{height:50}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="MENSAJES" fullWidth={true} ></RaisedButton></Link>
            </div>
          </div> 
          <div className="menu-container"> 
            <div>
            <RaisedButton href="http://1puntocinco.com/" style={{height:50}} labelColor="#FAFAFA"	 backgroundColor="#546E7A" label="ACADEMIA 1.5" fullWidth={true} ></RaisedButton>
            </div> 
          </div> 
             
        </div>
      );
    }
    
  }
  

export default Menu;

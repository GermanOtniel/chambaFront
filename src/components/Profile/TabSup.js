import React, {Component} from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router-dom';
import './profile.css';


class TabSup extends Component{

  state={
    open:false
  }

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  
  render(){
      return (
        <div>
      <Tabs
      tabItemContainerStyle={{background: '#bc960b'}} 
      inkBarStyle={{background:'#546E7A'}}
      //#bc960b
      >
      <Tab
        icon={<FontIcon className="material-icons">home</FontIcon>}
        label="Perfil"
        containerElement={<Link to={`/profile/${JSON.parse(localStorage.getItem('user'))._id}`}/>}
      />
      <Tab
        icon={<FontIcon className="material-icons">notification_important</FontIcon>}
        label="Dinámicas"
        containerElement={<Link to="/dinamicas"/>}
      />
      {/* <Tab
        icon={<FontIcon className="material-icons">store_mall_directory</FontIcon>}
        label="Market"
        containerElement={<Link to="/menu"/>}
      /> */}
      <Tab
        icon={<FontIcon className="material-icons">menu</FontIcon>}
        label="Menu"
        onActive={this.handleToggle}
      />
    </Tabs>
    <div>
   
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
            openSecondary={true}
          >
            <div>
            <div className="logoMenu"> 
            <div>
              <img alt="Logo 1.5" width="150px" src="https://firebasestorage.googleapis.com/v0/b/filetest-210500.appspot.com/o/testing%2Flogo1.5.png?alt=media&token=3288401a-902f-4601-a984-e564365bd3ed"/>
            </div>
            </div> 
          <div > 
            <div>
            <Link to="/ventas"><RaisedButton style={{height:50,marginTop:10}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="MIS VENTAS" fullWidth={true}></RaisedButton></Link>
            </div>
          </div> 
          {/* <div className="menu-container"> 
            <div>
            <Link to="/dinamicas"><RaisedButton style={{height:50}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="TICKETS" fullWidth={true}></RaisedButton></Link>
            </div>
          </div> 
          <div className="menu-container"> 
            <div>
            <Link to="/dinamicas"><RaisedButton style={{height:50}} labelColor="#FAFAFA" backgroundColor="#546E7A" label="MENSAJES" fullWidth={true} ></RaisedButton></Link>
            </div>
          </div>  */}
          <div > 
            <div>
            <RaisedButton href="https://15onzas.teachable.com/" style={{height:50,marginTop:10}} labelColor="#FAFAFA"	 backgroundColor="#546E7A" label="ACADEMIA 1.5" fullWidth={true} ></RaisedButton>
            </div> 
          </div> 
          </div>
          </Drawer>
          </div>
    </div>
      );
    }
    
  }
  

export default TabSup;




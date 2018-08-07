import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router-dom';
import './profile.css';


const TabSup = () =>  (
      <div>
      <Tabs
      tabItemContainerStyle={{background: '#bc960b'}} 
      //#bc960b
      >
      <Tab
        icon={<FontIcon className="material-icons">home</FontIcon>}
        label="Perfil"
        containerElement={<Link to={`/profile/${JSON.parse(localStorage.getItem('user'))._id}`}/>}
      />
      <Tab
        icon={<FontIcon className="material-icons">notification_important</FontIcon>}
        label="Nuevo"
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
        containerElement={<Link to="/menu"/>}
      />
    </Tabs>
    </div>
    )
  
export default TabSup;
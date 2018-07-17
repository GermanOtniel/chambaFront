import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router-dom';


const TabSup = () =>  (
      <div>
      <Tabs>
      <Tab
        icon={<FontIcon className="material-icons">home</FontIcon>}
        label="Mi perfil"
        containerElement={<Link to={`/profile/${JSON.parse(localStorage.getItem('user'))._id}`}/>}
      />
      <Tab
        icon={<FontIcon className="material-icons">notification_important</FontIcon>}
        label="Dinamicas"
        containerElement={<Link to="/dinamicas"/>}
      />
      <Tab
        icon={<FontIcon className="material-icons">store_mall_directory</FontIcon>}
        label="Market"
        containerElement={<Link to="/market"/>}
      />
      
      <Tab
        icon={<FontIcon className="material-icons">info</FontIcon>}
        label="Info"
        containerElement={<Link to="/info"/>}
      />
    </Tabs>
    </div>
    )
  
export default TabSup;
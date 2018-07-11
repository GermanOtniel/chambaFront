import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import Prueba from './components/Prueba/Content';


export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Signup}/>
      <Route path="/profile/:id" component={Profile}/>
      {/*<Route path="/prueba" component={Prueba}/>*/}
    </Switch>
  );
}
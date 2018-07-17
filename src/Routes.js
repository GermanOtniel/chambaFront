import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Dinamica from './components/Dinamicas/Dinamicas';
import DinamicDetail from './components/Dinamicas/DinamicDetail';
import Pruebas from './components/Prueba/Pruebas';
import Camara from './components/Prueba/Camara';


export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Signup}/>
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/login" component={Login}/>
      <Route path="/dinamicas" component={Dinamica}/>
      <Route path="/dinamica/:id" component={DinamicDetail}/>
      <Route path="/pruebas" component={Pruebas}/>
      <Route path="/camara" component={Camara}/>
    </Switch>
  );
}
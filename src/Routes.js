import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Dinamica from './components/Dinamicas/Dinamicas';
import DinamicDetail from './components/Dinamicas/DinamicDetail';
import Notas from './components/Mensajes/Notas';
import Ventas from './components/Ventas/Ventas';
import Evidencias from './components/Evidencias/Evidencias';


export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/dinamicas" component={Dinamica}/>
      <Route path="/dinamica/:id" component={DinamicDetail}/>
      <Route path="/mensajes" component={Notas}/>
      <Route path="/ventas" component={Ventas}/>
      <Route path="/evidencias" component={Evidencias}/>
    </Switch>
  );
}
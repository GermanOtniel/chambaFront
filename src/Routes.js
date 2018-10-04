import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import Login from './components/Login/Login';
import Dinamica from './components/Dinamicas/Dinamicas';
import DinamicDetail from './components/Dinamicas/DinamicDetail';
import Notas from './components/Mensajes/Notas';
import Ventas from './components/Ventas/Ventas';
import Evidencias from './components/Evidencias/Evidencias';
import SendEvidence from './components/Dinamicas/SendEvidence';


export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}/>
      <Route path="/profile/:id" component={Profile}/>
      <Route path="/edit/:id" component={EditProfile}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/dinamicas" component={Dinamica}/>
      <Route path="/dinamica/:id" component={DinamicDetail}/>
      <Route path="/sendevi/:id" component={SendEvidence}/>
      <Route path="/mensajes" component={Notas}/>
      <Route path="/ventas" component={Ventas}/>
      <Route path="/evidencias" component={Evidencias}/>
    </Switch>
  );
}
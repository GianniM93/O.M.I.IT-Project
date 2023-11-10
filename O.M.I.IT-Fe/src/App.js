// App.js
import React, { Component } from 'react';
import Welcome from './comps/jumbotron/MyJumbo';
import Main from './comps/main/Main';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./comps/login/MyLogin";
import SignUp from "./comps/signUp/mySignUp";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";
import Success from "./comps/ghSuccess/Success"
import InfoPage from './comps/infoPage/InfoPage';
import ProfilePage from './comps/profilePage/MyProfilePage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '', } }

  // Funzione per cambiare il valore di 'query' nello stato di App
  setQuery = (newQuery) => {
    this.setState({ query: newQuery }) }

render() {
  return (
    <BrowserRouter>
     <Welcome/>
      <Routes>
      <Route exact path="/" element={<Login/>} />
        <Route path="/signUp" element={<SignUp/>} />
        <Route path="/success/:token" element={<Success/>} />
        <Route element={<ProtectedRoutes/>}>
        <Route path="/home" 
        element={<Main appQuery={this.state.query} SetAppQuery={this.setQuery}/>}/>
        <Route path="/info" element={<InfoPage/>} />
        <Route path="/myprofile" element={<ProfilePage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  ) } }

export default App;


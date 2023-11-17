// App.js
import React, { Component } from 'react';
import Welcome from './comps/jumbotron/MyJumbo';
import Main from './pages/mainPage/MyMainPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login/MyLogin";
import SignUp from "./pages/signUp/MySignUp";
import ProtectedRoutes from "./middlewares/ProtectedRoutes";
import Success from "./comps/ghSuccess/Success"
import InfoPage from './pages/infoPage/MyInfoPage';
import ProfilePage from './pages/profilePage/MyProfilePage';
import VisitedUser from './pages/usersProfile/VisitedProfile';
import MyFooter from './comps/footer/MyFooter';

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
        <Route path="/myprofile" element={<ProfilePage appQuery={this.state.query} SetAppQuery={this.setQuery}/>} />
        <Route path="/userProfile/:postCreator" element={<VisitedUser appQuery={this.state.query} SetAppQuery={this.setQuery}/>} />
        </Route>
      </Routes>
      <MyFooter/>
    </BrowserRouter>
  ) } }

export default App;


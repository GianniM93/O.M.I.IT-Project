import React, {useState,useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";

const Welcome = ({user}) => {
  const navigate = useNavigate()
  const location = useLocation();
  const [userInfo, setUserInfo] = useState([]);

  //-------------------------LoggedUser--------------------------------------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('loggedInUser'));

        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/me`, {
          headers: {'loggedInUser': token },
        });
        if (!response.ok) {
          throw new Error('Errore nella richiesta') }
        const userData = await response.json();
        setUserInfo(userData);
        //console.log("Dati utente:",userData) 
  } catch (error) {
    console.error('Errore durante il recupero dei dati utente:', error);
  } };
fetchUserData() }, []);
//---------------------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/') };

    //-------------------------delete-----------------------------------'/users/delete/:userId'

const deleteUser = async (userId) => {
  const isConfirmed = window.confirm("Do You Really Want to Delete your Account?");
  if (!isConfirmed) {return}

  try {
      const token = JSON.parse(localStorage.getItem('loggedInUser'));
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/delete/${userId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'loggedInUser': token
          }
      });

      const result = await response.json();
      if (response.ok) {
          alert(result.message);
          //console.log('User Account Deleted');
          handleLogout();
      } else {
        alert('An error occurred: ' + result.message)
          console.error('Errore durante la cancellazione del Post') }
  } catch (error) {
    alert('An error occurred: ' + error.message)
      console.error('Errore di rete:', error);
  } };
//-------------------------------------------------------------------------

    const exactRoute = location.pathname !== '/' && location.pathname !== '/signUp';
    const exactRoute2 = location.pathname === '/myprofile' ;

  return (
    <div className="bg-light p-5 rounded-lg m-3 border border-primary">
      <h1 className="display-4 text-primary">O.M.I.IT</h1>
      <p className="lead">This is My Capstone Project!</p>
      {exactRoute && <button onClick={handleLogout}>Logout</button>}
      {exactRoute2 && <button onClick={()=>deleteUser(userInfo._id)}>Delete Account!</button>}
    </div>
  );
};

export default Welcome;

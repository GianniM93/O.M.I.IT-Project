import React from 'react';
import {useNavigate, useLocation} from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate()
  const location = useLocation();


  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/') };

    const exactRoute = location.pathname === '/home';

  return (
    <div className="bg-light p-5 rounded-lg m-3 border border-primary">
      <h1 className="display-4 text-primary">O.M.I.IT</h1>
      <p className="lead">This is My Capstone Project!</p>
      {exactRoute && <button onClick={handleLogout}>Logout</button>}
    </div>
  );
};

export default Welcome;

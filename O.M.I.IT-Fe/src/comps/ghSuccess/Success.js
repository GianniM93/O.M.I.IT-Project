import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Success() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Salva il token nel localStorage
  useEffect(() => {
    localStorage.setItem('loggedInUser', JSON.stringify(token));

    navigate('/home');
  }, [token, navigate]);

  return (
    <div>
      <h1>Loading Home Page...please wait!</h1>
    </div>
  );}

export default Success;

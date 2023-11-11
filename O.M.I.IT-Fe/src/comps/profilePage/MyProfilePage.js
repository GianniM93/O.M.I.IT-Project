import React, {useState,useEffect} from 'react';
import MyNavbar from '../navbar/MyNav';
import { navLinks } from '../../data/myNavData';

const ProfilePage=()=>{
    const [userInfo, setUserInfo] = useState([]);

    useEffect(() => {
        // Funzione per ottenere i dettagli dell'utente collegato
        const fetchUserData = async () => {
          try {
            const token = JSON.parse(localStorage.getItem('loggedInUser'));
    
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/me`, {
              headers: {'loggedInUser': token },
            });
    
            if (!response.ok) {
              
              throw new Error('Errore nella richiesta');
            }
    
            const userData = await response.json();
            setUserInfo(userData);
            console.log("Dati utente:",userData)

            
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente:', error);
      }
    };

    fetchUserData();
  }, []);

    return (
    <>
    <MyNavbar className="mb-4"  links={navLinks} />
    <p>pagina profilo</p>
    <div>
        <h1>{userInfo.firstName} "{userInfo.nickName}" {userInfo.lastName}</h1>
       <img src={userInfo.avatar}/>
    </div>
    </>
    )}

export default ProfilePage;
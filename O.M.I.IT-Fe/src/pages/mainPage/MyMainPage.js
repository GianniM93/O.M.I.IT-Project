import React, {useState,useEffect} from 'react';
import LatestPosts from "../../comps/latestPosts/LatestPosts";
import Button from 'react-bootstrap/Button';
import AddPostModal from '../../comps/addPostModal/AddPostModal';
import MyNavbar from '../../comps/navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import MyFooter from '../../comps/footer/MyFooter';

const Main=({appQuery,SetAppQuery})=>{
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userInfo, setUserInfo] = useState([]);

const toggleModal = () => setIsModalOpen(!isModalOpen)

useEffect(() => {
  // Funzione per ottenere i dettagli dell'utente collegato
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
fetchUserData();
}, []);

return(
<>
<div>
<MyNavbar appQuery={appQuery} SetAppQuery={SetAppQuery} links={navLinks} />
 <Button className="mb-4"
   onClick={toggleModal}
   variant="primary ms-3 my-3">
   Add Post!
 </Button>
</div>
{isModalOpen && (<AddPostModal close={setIsModalOpen} userInfo={userInfo} /> )}
<div>
<LatestPosts appQuery={appQuery} userInfo={userInfo} />
</div>
<MyFooter />
</> ) }
export default Main;  
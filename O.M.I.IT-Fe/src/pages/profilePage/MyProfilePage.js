import React, {useState,useEffect} from 'react';
import MyNavbar from '../../comps/navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import Button from 'react-bootstrap/Button';
import './myProfile.css'
import CollectionList from '../../comps/userCollection/MyUserCollection';
import AddNewGame from '../../comps/addGame/AddNewGame';

const ProfilePage=()=>{
    const [userInfo, setUserInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpen2, setIsModalOpen2] = useState(false)

    const toggleModal = () => setIsModalOpen(!isModalOpen)
    const toggleModal2 = () => setIsModalOpen2(!isModalOpen2)

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
    fetchUserData();
  }, []);
//------------------------------------------------------------------------------

    return (
    <>
    <MyNavbar className="mb-4"  links={navLinks} />
    <div>
        <h1>{userInfo.firstName} "{userInfo.nickName}" {userInfo.lastName}</h1>
       <img src={userInfo.avatar} alt='' className='avt'/>
    </div>
    <Button className="mb-4"
     onClick={toggleModal}
     variant="primary ms-3 my-3">
     Add Post!
    </Button>
    <Button className="mb-4"
     onClick={toggleModal2}
     variant="primary ms-3 my-3">
     See List!
    </Button>
    {isModalOpen && (<AddNewGame close={setIsModalOpen} /> )}
    {isModalOpen2 && (<CollectionList close={setIsModalOpen2} games={userInfo.userCollection} gamer={userInfo._id} /> )}
    </>
    )}

export default ProfilePage;
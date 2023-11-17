import React, {useState,useEffect} from 'react';
import MyNavbar from '../../comps/navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import Button from 'react-bootstrap/Button';
import './myProfile.css'
import CollectionList from '../../comps/userCollection/MyUserCollection';
import AddNewGame from '../../comps/addGame/AddNewGame';
import UserEdit from '../../comps/userEdit/MyUseredit';
import MyPosts from '../../comps/userPosts/MyPosts';

const ProfilePage=({appQuery,SetAppQuery})=>{
    const [userInfo, setUserInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpen2, setIsModalOpen2] = useState(false)
    const [isModalOpen3, setIsModalOpen3] = useState(false)
    const [isModalOpen4, setIsModalOpen4] = useState(false)

    const toggleModal = () => setIsModalOpen(!isModalOpen)
    const toggleModal2 = () => setIsModalOpen2(!isModalOpen2)
    const toggleModal3 = () => setIsModalOpen3(!isModalOpen3)
    const toggleModal4 = () => setIsModalOpen4(!isModalOpen4)

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
    <MyNavbar className="mb-4" appQuery={appQuery} SetAppQuery={SetAppQuery} links={navLinks} />
    <div>
        <h1>{userInfo.firstName} "{userInfo.nickName}" {userInfo.lastName}</h1>
       <img src={userInfo.avatar} alt='' className='avt'/>
    </div>
    <Button className="mb-4"
     onClick={toggleModal}
     variant="primary ms-3 my-3">
     Add Game!
    </Button>
    <Button className="mb-4"
     onClick={toggleModal2}
     variant="primary ms-3 my-3">
     My Collection!
    </Button>
    <Button className="mb-4"
     onClick={toggleModal3}
     variant="warning ms-3 my-3">
     Edit User!
    </Button>
    <Button className="mb-4"
     onClick={toggleModal4}
     variant="warning ms-3 my-3">
     My Posts!
    </Button>
    {isModalOpen && (<AddNewGame close={setIsModalOpen} userInfo={userInfo}/> )}
    {isModalOpen2 && (<CollectionList close={setIsModalOpen2} userInfo={userInfo} appQuery={appQuery} /> )}
    {isModalOpen3 && (<UserEdit close={setIsModalOpen3} gamer={userInfo._id} /> )}
    {isModalOpen4 && (<MyPosts close={setIsModalOpen4} userInfo={userInfo} appQuery={appQuery} /> )}
    </>
    )}

export default ProfilePage;
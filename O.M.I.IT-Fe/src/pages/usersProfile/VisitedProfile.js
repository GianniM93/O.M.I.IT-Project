import React, {useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import MyNavbar from '../../comps/navbar/MyNav';
import { navLinks } from '../../data/myNavData';
import Button from 'react-bootstrap/Button';
import VCollectionList from '../../comps/userCollection/VUserCollection';
import VPosts from '../../comps/userPosts/VPosts';

const VisitedUser=({appQuery,SetAppQuery})=>{
    const {postCreator} = useParams();
    const [userInfo, setUserInfo] = useState([]);
    const [myInfo, setMyInfo] = useState([]);
    const [isModalOpen2, setIsModalOpen2] = useState(false)
    const [isModalOpen4, setIsModalOpen4] = useState(false)

    
    const toggleModal2 = () => setIsModalOpen2(!isModalOpen2)
    const toggleModal4 = () => setIsModalOpen4(!isModalOpen4)

    //-------------------------VisitedUser--------------------------------------------------------
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = JSON.parse(localStorage.getItem('loggedInUser'));
    
            const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/byid/${postCreator}`, {
              headers: {'loggedInUser': token },
            });
    
            if (!response.ok) {
              throw new Error('Errore nella richiesta') }
    
            const userData = await response.json();
            setUserInfo(userData.users);
            console.log("Dati utente:",userData) 
      } catch (error) {
        console.error('Errore durante il recupero dei dati utente:', error);
      } };
    fetchUserData();
  }, []);
//------------------------------------------------------------------------------

//-------------------------LoggedUser--------------------------------------------------------
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('loggedInUser'));

      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/me`, {
        headers: {'loggedInUser': token },
      });

      if (!response.ok) {
        throw new Error('Request Error') }

      const userData = await response.json();
      setMyInfo(userData);
      //console.log("Dati utente:",userData) 
} catch (error) {
  console.error('Error while fetching user data:', error);
} };
fetchUserData();
}, []);
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------

    return (
    <>
    <MyNavbar className="mb-4" appQuery={appQuery} SetAppQuery={SetAppQuery} links={navLinks} />
    <div>
        <h1>{userInfo.birthDate} "{userInfo.nickName}" {userInfo.lastName}</h1>
       <img src={userInfo.avatar} alt='' className='avt'/>
    </div>
    <Button className="mb-4"
     onClick={toggleModal2}
     variant="primary ms-3 my-3">
     My Collection!
    </Button>
    <Button className="mb-4"
     onClick={toggleModal4}
     variant="warning ms-3 my-3">
     My Posts!
    </Button>
    {isModalOpen2 && (<VCollectionList close={setIsModalOpen2} userInfo={userInfo} myInfo={myInfo} appQuery={appQuery} />)}
    {isModalOpen4 && (<VPosts close={setIsModalOpen4} userInfo={userInfo} myInfo={myInfo} appQuery={appQuery} />)}
    </>
    )}

export default VisitedUser;
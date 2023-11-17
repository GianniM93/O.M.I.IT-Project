import React, {useState,useEffect} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import UserEdit from '../userEdit/MyUseredit';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Modal from 'react-bootstrap/Modal';
import './myJumbo.css'

const Welcome = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [userInfo, setUserInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => setIsModalOpen(!isModalOpen)

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
    <>
      <div className="p-4 rounded-lg m-2 border border-primary welcome-background">
        <div className='PageTitle'>
        <h1 className="display-4 text-primary">O.M.I.IT</h1>
        <p className="lead">This is My Capstone Project!</p>
        </div>
        {exactRoute && (
        <Navbar  className="bg-body-tertiary ms-auto myNav xs-myNav2 p-0">
      <Container fluid className='navCon'>
        <Navbar.Toggle aria-controls="basic-navbar-nav p-0" />
        <Navbar.Collapse className='top' id="basic-navbar-nav">
          <Nav className="ms-auto mb-auto p-0">
            <NavDropdown className="drop"
            title="Settings" id="basic-nav-dropdown">
               <Button className="ms-1 mt-1 p-0"
               onClick={handleLogout} variant="secondary"
               >Logout</Button>
              {exactRoute2 && (
          <>
            <Button className="ms-1 mt-1 p-0 navButton"
            onClick={() => deleteUser(userInfo._id)}
            variant="danger"
            >Delete Account!</Button>
            <Button className="ms-1 mt-1 p-0"
              onClick={toggleModal}
              variant="warning ">
              Edit User!
            </Button>

            <Modal show={isModalOpen} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserEdit gamer={userInfo._id} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
          </>
        )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar> )}
      </div>
    </>
  ) };  

export default Welcome;

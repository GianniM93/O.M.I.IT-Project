import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CommentList from '../commentList/CommentList';
import AddComment from '../addComment/AddComment';
import './singlePost.css'

const SingleBook = ({id,category,title,cover,value,unit,name,avatar,content,date,postComments,postCreator}) => {
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        //console.log("Dati utente:",userData)

        
  } catch (error) {
    console.error('Errore durante il recupero dei dati utente:', error);
  } };

fetchUserData();
}, []);

//-------------------------delete-----------------------------------

const deletePost = async (postId) => {
  try {
      const token = JSON.parse(localStorage.getItem('loggedInUser'));
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${postCreator}/posts/${postId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'loggedInUser': token
          }
      });

      const result = await response.json();
      if (response.ok) {
          // Rimuovi il post cancellato dalla lista o ricarica i post
          alert(result.message);
          console.log('Post cancellato con successo');
      } else {
        alert('An error occurred: ' + result.message)
          console.error('Errore durante la cancellazione del Post') }
  } catch (error) {
    alert('An error occurred: ' + error.message)
      console.error('Errore di rete:', error);
  } };
//-------------------------------------------------------------------------


  const toggleModal = () => setIsModalOpen(!isModalOpen)

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

return (
    <div className="d-flex justify-content-center align-items-center ms-3" sm={12}>
      <Card key={id} border="primary" style={{ width: '18rem' }}>
        <div ><Card.Img className='cvr'
          variant="top" src={cover} /></div>
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            Category: {category}
          </Card.Text>
          <Card.Text>
            Author: {name}
          </Card.Text>
          <div className='avt'><Card.Img  src={avatar} /></div>
          <Card.Text>
            Reading Time: {value} {unit}
          </Card.Text>
          <Card.Text>
            Date: {date}
          </Card.Text>
          <Card.Text class='text-primary'>
           {content}
          </Card.Text>
          <Button variant="primary" onClick={handleShowModal}>Comments</Button>
          {postCreator === userInfo._id && (
          <Button 
          onClick={() => deletePost(id)} 
          variant="danger">
              Delete!
          </Button> )}
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Comments!</Modal.Title>
    <Button
   onClick={toggleModal}
   variant="primary ms-3 my-3">
   Add Comment!
 </Button>
 {isModalOpen && (<AddComment infoId={id} infoName={name} close={setIsModalOpen} /> )}
  </Modal.Header>
  <Modal.Body>
  <CommentList infoId={id} comments={postComments} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Chiudi
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  )
}

export default SingleBook;

import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CommentList from '../commentList/CommentList';
import AddComment from '../addComment/AddComment';
import './singlePost.css'

const SingleBook = ({ id, category, title, cover, value, unit, name, avatar, content, date, postComments }) => {
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)

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
          <Button variant="danger">Delete!</Button>
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
  <CommentList comments={postComments} />
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

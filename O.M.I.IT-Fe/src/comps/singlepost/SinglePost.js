import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CommentList from '../commentList/CommentList';
import AddComment from '../addComment/AddComment';
import { useNavigate } from 'react-router-dom'; 
import './singlePost.css'

const SinglePost = ({post,id,category,title,cover,value,unit,name,avatar,content,date,postComments,postCreator,userInfo}) => {
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //const [userInfo, setUserInfo] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  console.log('myinfos', userInfo._id);


//-------------------------delete-----------------------------------

const deletePost = async (postId) => {
  const isConfirmed = window.confirm("Do You Really Want to Delete your Post?");
  if (!isConfirmed) {return}

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

//---------------------------PATCH-------'/:gamerId/posts/:postId'-----------------------

const startEdit = (post) => {
  //console.log(post)
  setEditingPost(post);
};

const onChangeSetFile = (e) => {
  setFile(e.target.files[0]) }

const uploadFile = async (cover) => {
  const fileData = new FormData()
  fileData.append('cover', cover)

  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts/cloudUpload`, {
        method: "POST",
        body: fileData
    })
    return await response.json()
} catch (error) {
    console.log(error, 'Error in uploadFile') } }

const submitEdit = async (postId, updatedFields) => {
  try {
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${postCreator}/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'loggedInUser': token },
      body: JSON.stringify({
        newCategory: updatedFields.category,
        newTitle: updatedFields.title,
        newValue: updatedFields.value,
        newUnit: updatedFields.unit,
        newContent: updatedFields.content
      })
    });

    const result = await response.json();
    if (response.ok) {
      //setEditingPost(null);
      alert('Post updated successfully');
    } else {
      alert('Error: ' + result.message) }
  } catch (error) {
    alert('Network error: ' + error.message);
  } };
//-----------------------------------------------------------

const submitCover = async (postId) => {
  try {
    const uploadCover = await uploadFile(file)
    //console.log('uploadCover', uploadCover)
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${postCreator}/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'loggedInUser': token },
      body: JSON.stringify({
        newCover: uploadCover.cover })
    });

    const result = await response.json();
    if (response.ok) {
      //setEditingPost(null);
      alert('Post updated successfully');
    } else {
      alert('Error: ' + result.message) }
  } catch (error) {
    alert('Network error: ' + error.message);
  } };



//------------------------------------------------------------------
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const handleShowModal = () => {
    setShowModal(true) };
  const handleCloseModal = () => {
    setShowModal(false) };

    const visitUserProfile = () => {
      navigate(`/userProfile/${postCreator}`) };

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
            Author: <span onClick={visitUserProfile} style={{ cursor: 'pointer', color: 'blue' }}>{name}</span>
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
            <div>
          <Button 
          onClick={() => deletePost(id)}     
          variant="danger">
              Delete!
          </Button> 
          <Button 
          onClick={() => startEdit(post)} 
          variant="warning">
              Edit!
          </Button> 
          </div> )}

          {editingPost && (
  <div>
    <input 
      type="text"
      value={editingPost.category}
      onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
    />
    <button onClick={() => submitEdit(editingPost._id, { 
      category: editingPost.category  })}>
      Edit Category
    </button>

    <input 
      type="text"
      value={editingPost.title}
      onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
    />
    <button onClick={() => submitEdit(editingPost._id, {  
      title: editingPost.title  })}>
     Edit Title
    </button>

    <input 
      type="number"
      value={editingPost.value}
      onChange={(e) => setEditingPost({...editingPost, value: e.target.value})}
    />
    <button onClick={() => submitEdit(editingPost._id, { 
      value: editingPost.value  })}>
      Edit ReadTime Value
    </button>

    <input 
      type="text"
      value={editingPost.unit}
      onChange={(e) => setEditingPost({...editingPost, unit: e.target.value})}
    />
    <button onClick={() => submitEdit(editingPost._id, { 
      unit: editingPost.unit  })}>
      Edit ReadTime Unit
    </button>

    <input 
      type="text"
      value={editingPost.content}
      onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
    />
    <button onClick={() => submitEdit(editingPost._id, { 
      content: editingPost.content  })}>
      Edit Content
    </button>

    <input 
      type="file"
      onChange={onChangeSetFile} />
    <button onClick={() => submitCover(editingPost._id)}>
      Edit Cover
    </button>

    <div> 
      <Button  variant="secondary" onClick={() => setEditingPost(null)}>
      Close
    </Button> </div>
  </div>
)}
          
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
 {isModalOpen && (<AddComment infoId={id} infoName={name} userInfo={userInfo} close={setIsModalOpen} /> )}
  </Modal.Header>
  <Modal.Body>
  <CommentList infoId={id} comments={postComments} userInfo={userInfo} />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Chiudi
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  ) }

export default SinglePost;

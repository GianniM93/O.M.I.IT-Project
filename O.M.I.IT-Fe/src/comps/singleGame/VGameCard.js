import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
//import Modal from 'react-bootstrap/Modal';

const VGameCard = ({game,id,gameTitle,gameCover,developer,publisher,genres,releaseDate,platforms,collCreator,userInfo,myInfo}) => {
  //const [showModal, setShowModal] = useState(false);
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [file, setFile] = useState(null)
  //const [formData, setFormData] = useState({});

//-------------------------delete-----------------------------------

const deleteGame = async (gameId) => {
  const isConfirmed = window.confirm("Do You Really Want to Delete your Game?");
  if (!isConfirmed) {return}

  try {
      const token = JSON.parse(localStorage.getItem('loggedInUser'));
      const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${collCreator}/collections/${gameId}`, {
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
          console.log('Game cancellato con successo');
      } else {
        alert('An error occurred: ' + result.message)
          console.error('Errore durante la cancellazione del Game') }
  } catch (error) {
    alert('An error occurred: ' + error.message)
      console.error('Errore di rete:', error);
  } };
//---------------------------PATCH-------'/:gamerId/collections/:collectionId'-----------------------

const startEdit = (game) => {
  //console.log(game)
  setEditingGame(game);
};

const onChangeSetFile = (e) => {
  setFile(e.target.files[0]) }

const uploadFile = async (gameCover) => {
  const fileData = new FormData()
  fileData.append('gameCover', gameCover)

  try {
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/collections/cloudUpload`, {
        method: "POST",
        body: fileData
    })
    return await response.json()
} catch (error) {
    console.log(error, 'Errore in uploadFile') } }

const submitEdit = async (gameId, updatedFields) => {
  try {
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${collCreator}/collections/${gameId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'loggedInUser': token },
      body: JSON.stringify({
        newGameTitle: updatedFields.gameTitle,
        newDeveloper: updatedFields.developer,
        newPublisher: updatedFields.publisher,
        newGenres: updatedFields.genres,
        newReleaseDate: updatedFields.releaseDate,
        newPlatforms: updatedFields.platforms
      })
    });

    const result = await response.json();
    if (response.ok) {
      //setEditingGame(null);
      alert('Game updated successfully');
    } else {
      alert('Error: ' + result.message) }
  } catch (error) {
    alert('Network error: ' + error.message);
  } };
//-----------------------------------------------------------

const submitCover = async (gameId) => {
  try {
    const uploadCover = await uploadFile(file)
    //console.log('uploadCover', uploadCover)
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${collCreator}/collections/${gameId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'loggedInUser': token },
      body: JSON.stringify({
        newGameCover: uploadCover.gameCover })
    });

    const result = await response.json();
    if (response.ok) {
      //setEditingGame(null);
      alert('Game updated successfully');
    } else {
      alert('Error: ' + result.message) }
  } catch (error) {
    alert('Network error: ' + error.message);
  } };


/* const toggleModal = () => setIsModalOpen(!isModalOpen)
  const handleShowModal = () => {
    setShowModal(true) };
  const handleCloseModal = () => {
    setShowModal(false) };   */

return (
    <div className="d-flex justify-content-center align-items-center ms-3" sm={12}>
      <Card key={id} border="primary" style={{ width: '18rem' }}>
        <div ><Card.Img className='cvr'
          variant="top" src={gameCover} /></div>
        <Card.Body>
          <Card.Title>{gameTitle}</Card.Title>
          <Card.Text>
            Genres: {genres}
          </Card.Text>
          <Card.Text>
            Developer: {developer}
          </Card.Text>
          <Card.Text>
            Publisher: {publisher}
          </Card.Text>
          <Card.Text>
            R_Date: {releaseDate}
          </Card.Text>
          <Card.Text>
            Platforms: {platforms}
          </Card.Text>
 {/*      <Button variant="primary" onClick={handleShowModal}>Comments</Button>   */} 
          {collCreator === myInfo._id && (
          <div>
          <Button 
          onClick={() => deleteGame(id)}         
          variant="danger">
              Delete!
          </Button> 
          <Button 
          onClick={() => startEdit(game)} 
          variant="warning">
              Edit!
          </Button> 
          </div> )}
          
          {editingGame && (
  <div>
    <input 
      type="text"
      value={editingGame.gameTitle}
      onChange={(e) => setEditingGame({...editingGame, gameTitle: e.target.value})}
    />
    <button onClick={() => submitEdit(editingGame._id, { 
      gameTitle: editingGame.gameTitle  })}>
      Edit gameTitle
    </button>

    <input 
      type="text"
      value={editingGame.developer}
      onChange={(e) => setEditingGame({...editingGame, developer: e.target.value})}
    />
    <button onClick={() => submitEdit(editingGame._id, {  
      developer: editingGame.developer  })}>
     Edit Developer
    </button>

    <input 
      type="text"
      value={editingGame.publisher}
      onChange={(e) => setEditingGame({...editingGame, publisher: e.target.value})}
    />
    <button onClick={() => submitEdit(editingGame._id, { 
      publisher: editingGame.publisher  })}>
      Edit Publisher
    </button>

    <input 
      type="text"
      value={editingGame.genres}
      onChange={(e) => setEditingGame({...editingGame, genres: e.target.value})}
    />
    <button onClick={() => submitEdit(editingGame._id, { 
      genres: editingGame.genres  })}>
      Edit Genres
    </button>

    <input 
      type="text"
      value={editingGame.releaseDate}
      onChange={(e) => setEditingGame({...editingGame, releaseDate: e.target.value})}
    />
    <button onClick={() => submitEdit(editingGame._id, { 
      releaseDate: editingGame.releaseDate  })}>
      Edit Release Date
    </button>

    <input 
      type="text"
      value={editingGame.platforms}
      onChange={(e) => setEditingGame({...editingGame, platforms: e.target.value})}
    />
    <button onClick={() => submitEdit(editingGame._id, { 
      platforms: editingGame.platforms  })}>
      Edit Platforms
    </button>

    <input 
      type="file"
      onChange={onChangeSetFile} />
    <button onClick={() => submitCover(editingGame._id)}>
      Edit gameCover
    </button>

    <div> 
      <Button variant='secondary' onClick={() => setEditingGame(null)}>
      Close
    </Button> </div>
  </div>
)}
        </Card.Body>
      </Card>
{/*      <Modal show={showModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Comments!</Modal.Title>
    <Button
   onClick={toggleModal}
   variant="primary ms-3 my-3">               
   Add Comment!
 </Button>
    {isModalOpen && (<AddComment infoId={id} infoName={name} close={setIsModalOpen} /> )} 
  </Modal.Header>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Chiudi
    </Button>
  </Modal.Footer>
</Modal>     */} 
    </div>
  ) }

export default VGameCard;

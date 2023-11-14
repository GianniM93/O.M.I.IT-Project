import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';

const CommentList = ({ comments, infoId }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [editingComment, setEditingComment] = useState(null);

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

  //-----------------------------DELETE----------------------------------------
  const deleteComment = async (commentId) => {
    try {
        const token = JSON.parse(localStorage.getItem('loggedInUser'));
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${infoId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'loggedInUser': token }
        });
        const result = await response.json();
        if (response.ok) {
            // Rimuovi il commento cancellato dalla lista o ricarica i commenti
            alert(result.message);
            console.log('Commento cancellato con successo');
        } else {
          alert('An error occurred: ' + result.message)
            console.error('Errore durante la cancellazione del commento') }
    } catch (error) {
      alert('An error occurred: ' + error.message)
        console.error('Errore di rete:', error);
    } };
//--------------------------------------------------------------------------

const startEdit = (comment) => {
  //console.log(comment)
  setEditingComment(comment);
};

const submitEdit = async (commentId, updatedFields) => {
  try {
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${infoId}/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'loggedInUser': token },
      body: JSON.stringify({
        newComm: updatedFields.comm,
        newRating: updatedFields.rate
      })
    });

    const result = await response.json();
    if (response.ok) {
      //setEditingComment(null);
      alert('Comment updated successfully');
    } else {
      alert('Error: ' + result.message) }
  } catch (error) {
    alert('Network error: ' + error.message);
  } };


//--------------------------------------------------------------------------
  return (
    <div>
      <ul>
      {comments.map((comment) => (
  <li key={comment._id}>
   {comment.comm}, Rate: {comment.rate}, From: {comment.commAuthor},
   {comment.commCreator === userInfo._id && (
    <div>
    <Button 
    onClick={() => deleteComment(comment._id)}         
    variant="danger">
        Delete!
    </Button> 
    <Button 
    onClick={() => startEdit(comment)} 
    variant="warning">
        Edit!
    </Button> 
    </div> )}

  </li> ))}
      </ul>
    {editingComment && (
  <div>
    <input 
      type="text"
      value={editingComment.comm}
      onChange={(e) => setEditingComment({...editingComment, comm: e.target.value})}
    />
    <button onClick={() => submitEdit(editingComment._id, { 
      comm: editingComment.comm  })}>
      Edit Comment
    </button>

    <input 
      type="number" min="1" max="5"
      value={editingComment.rate}
      onChange={(e) => setEditingComment({...editingComment, rate: e.target.value})}
    />
    <button onClick={() => submitEdit(editingComment._id, {  
      rate: editingComment.rate  })}>
     Edit Rate
    </button>
    <div>
    <button onClick={() => setEditingComment(null)}>
      Close
    </button> </div>
  </div>
)}
    </div>
  )};

export default CommentList;
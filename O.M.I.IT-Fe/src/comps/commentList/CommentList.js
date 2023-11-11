import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';

const CommentList = ({ comments, infoId }) => {

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
      }
    };

    fetchUserData();
  }, []);

  const deleteComment = async (commentId) => {
    try {
        const token = JSON.parse(localStorage.getItem('loggedInUser'));
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${infoId}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'loggedInUser': token
            }
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


  return (
    <div>
      <ul>
      {comments.map((comment) => (
  <li key={comment._id}>
   {comment.comm}, Rate: {comment.rate}, From: {comment.commAuthor},
   {comment.commCreator === userInfo._id && (
    <Button 
    onClick={() => deleteComment(comment._id)} 
    variant="danger">
        Delete!
    </Button>
)}

  </li> ))}
      </ul>
    </div>
  )};

export default CommentList;
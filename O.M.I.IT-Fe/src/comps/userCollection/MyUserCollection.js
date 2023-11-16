import React from 'react';
import Button from 'react-bootstrap/Button';
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import GameCard from '../singleGame/GameCard';

const CollectionList = ({close,games,gamer,appQuery}) => {

  //const [userInfo, setUserInfo] = useState([]);

  /*  useEffect(() => {
        // Funzione per ottenere i dettagli dell'utente collegato
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
  }, []);   */

  /* const deleteComment = async (commentId) => {
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
    } };  */

  // Filtraggio dei post in base alla query di ricerca
  const filteredGames = appQuery
  ? games && games?.filter((game) =>
      game.gameTitle.toLowerCase().includes(appQuery.toLowerCase())
    )
  : games;


  return (
    <>
      <Container className="mb-5">
        <Row>
          <Col className="d-flex flex-wrap gap-4">
          {filteredGames && filteredGames?.map((game) => (
  <GameCard
  key={game._id}
  id={game._id}
  gameTitle={game.gameTitle}
  gameCover={game.gameCover}
  developer={game.developer}
  publisher={game.publisher}
  genres={game.genres}
  releaseDate={game.releaseDate}
  platforms={game.platforms}
  collCreator={game.collCreator}
  game={game}
/>
))}
  </Col>
   </Row>
    </Container>
      <Button onClick={() => close(false)}  variant="primary mb-3">
        Close
      </Button>
    </>
  )};

export default CollectionList;

/*
gameTitle,
gameCover,
developer,
publisher,
genres,
releaseDate,
platforms,
collCreator */
import React from 'react';
import Button from 'react-bootstrap/Button';
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import GameCard from '../singleGame/GameCard';

const CollectionList = ({close,userInfo,appQuery}) => {

  // Filtraggio dei post in base alla query di ricerca
  const games=userInfo.userCollection
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
  userInfo={userInfo} />
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
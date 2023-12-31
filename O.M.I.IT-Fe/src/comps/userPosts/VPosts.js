import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from 'react-bootstrap/Button';
import SingleVPost from "../singlepost/SingleVPost";

const VPosts = ({close,userInfo,myInfo,appQuery}) => {
  const [posts, setPosts] = useState([]); 

  useEffect(() => {
    const gamer=userInfo._id
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/${gamer}/posts`, {
          headers: {"loggedInUser": token }} );
        if (!response.ok) {
          throw new Error("Errore nella richiesta");
        }
        const data = await response.json();
        setPosts(data.posts); 
      } catch (error) {
        console.error("Errore durante il recupero dei post:", error);
      } };

      fetchPosts();
   }, [userInfo._id]);

  // Filtraggio dei post in base alla query di ricerca
  const filteredPosts = appQuery
    ? posts && posts?.filter((post) =>
        post.title.toLowerCase().includes(appQuery.toLowerCase())
      )
    : posts;

  return (
    <>
      <Container className="mb-5">
        <Row>
          <Col className="d-flex flex-wrap gap-4">
            {filteredPosts && filteredPosts?.map((post) => (
             
              <SingleVPost
                key={post._id}
                id={post._id}
                category={post.category}
                title={post.title}
                cover={post.cover}
                readTime={post.readTime}
                value={post.readTime.value}
                unit={post.readTime.unit}
                author={post.author}
                name={post.author.name}
                avatar={post.author.avatar}
                content={post.content}
                date={post.createdAt}
                postComments={post.postComments}
                postCreator={post.postCreator}
                post={post}
                userInfo={userInfo}
                myInfo={myInfo}
              />
            ))}
          </Col>
        </Row>
      </Container>
      <Button onClick={() => close(false)}  variant="secondary mb-3">
        Close
      </Button>
    </>
  ) };

export default VPosts;

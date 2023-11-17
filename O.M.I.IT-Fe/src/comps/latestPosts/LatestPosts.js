import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import SinglePost from "../singlepost/SinglePost";

const LatestRelease = ({userInfo,appQuery }) => {
  const [posts, setPosts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('loggedInUser'));
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/posts?page=${currentPage}`,{
          headers: {"loggedInUser": token }} );
        if (!response.ok) {
          throw new Error("Errore nella richiesta") }
        const data = await response.json();
        setPosts(data.posts); 
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Errore durante il recupero dei post:", error);
      } };
      fetchPosts();
   }, [currentPage]);

  // Filtraggio dei post in base alla query di ricerca
  const filteredPosts = appQuery
    ? posts && posts?.filter((post) =>
        post.title.toLowerCase().includes(appQuery.toLowerCase()) )
    : posts;

  return (
    <>
      <Container className="mb-5">
        <Row>
          <Col className="d-flex flex-wrap gap-4">
            {filteredPosts && filteredPosts?.map((post) => (
             
              <SinglePost
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
              />
            ))}
          </Col>
        </Row>
      </Container>
      <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1}>
           Prev Page
       </button>
       <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages}>
           Next Page
       </button>
    </>
  ) };

export default LatestRelease;

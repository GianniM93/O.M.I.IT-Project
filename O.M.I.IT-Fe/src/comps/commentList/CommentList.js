import React from 'react';

const CommentList = ({ comments }) => {
  return (
    <div>
      <ul>
      {comments.map((comment) => (
  <li key={comment._id}>
   {comment.comm}, Rate: {comment.rate}, From: {comment.commAuthor}
  </li> ))}
      </ul>
    </div>
  )};

export default CommentList;
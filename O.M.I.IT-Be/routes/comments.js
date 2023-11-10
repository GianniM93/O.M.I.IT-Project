const express=require('express')
const CommentModel = require('../models/comment')
const PostModel = require('../models/post')
const verifyToken = require('../middlewares/verifyToken')

const comments=express.Router()

//----------------------GET---------------------

// Endpoint per ottenere tutti i commenti di un post specifico
comments.get('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
  
    try {
      const post = await PostModel.findById(postId).populate('postComments');
      if (!post) {
        return res.status(404).send({
          statusCode: 404,
          message: "Post not found!"
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        comments: post.postComments
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server"
      });
    }
  });
  

 //----------------GETbyID----------------------

comments.get('/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
  
    try {
      const post = await PostModel.findById(postId).populate('postComments');
      if (!post) {
        return res.status(404).send({
          statusCode: 404,
          message: "Post not found!"
        });
      }
  
      const comment = post.postComments.find((c) => c._id.toString() === commentId);
      if (!comment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Comment not found!"
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        comment
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server"
      });
    }
  });
  

//------------POST--------------------------

comments.post('/:postId/add-comment', async (req, res) => {
  const { postId } = req.params;
  const { comm, rate, commAuthor } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post not found!"
      });
    }

    const newComment = new CommentModel({
      comm: comm,
      rate: rate, // Not Required
      commAuthor: commAuthor
    });

    const savedComment = await newComment.save();
    post.postComments.push(savedComment);
    await post.save();

    res.status(201).send({
      statusCode: 201,
      message: "Comment added successfully",
      comment: savedComment
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server"
    });
  }
});

//---------------------PATCH-------------------

comments.patch('/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
    const { newComm, newRating } = req.body; // Estrai i nuovi dati del commento dal corpo della richiesta
  
    try {
      const post = await PostModel.findById(postId).populate('postComments');
      if (!post) {
        return res.status(404).send({
          statusCode: 404,
          message: "Post not found!"
        });
      }
  
      const comment = post.postComments.find((c) => c._id.toString() === commentId);
      if (!comment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Comment not found!"
        });
      }
  
      // Aggiorna i dati del commento con i nuovi valori
      comment.comm = newComm;
      comment.rate = newRating;
      await comment.save();
  
      res.status(200).send({
        statusCode: 200,
        message: "Comment updated successfully",
        comment
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server"
      });
    }
  });
  

//------------------DELETE------------------

comments.delete('/:postId/comments/:commentId', async (req, res) => {
    const { postId, commentId } = req.params;
  
    try {
      const post = await PostModel.findById(postId).populate('postComments');
      if (!post) {
        return res.status(404).send({
          statusCode: 404,
          message: "Post not found!"
        });
      }
  
      const comment = post.postComments.find((c) => c._id.toString() === commentId);
      if (!comment) {
        return res.status(404).send({
          statusCode: 404,
          message: "Comment not found!"
        });
      }
  
      // Rimuovi il commento dal post e dal database
      post.postComments.pull(comment);
      await comment.deleteOne();
      await post.save();
  
      res.status(200).send({
        statusCode: 200,
        message: "Comment deleted successfully"
      });
    } catch (e) {
        console.error('Errore durante la rimozione del commento:', e);
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server"
      });
    }
  });
  

module.exports=comments
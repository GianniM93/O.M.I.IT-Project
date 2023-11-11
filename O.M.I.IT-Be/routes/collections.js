const express=require('express')
const CollectionModel = require('../models/collection')
const UserModel = require('../models/user')
const verifyToken = require('../middlewares/verifyToken')

const collections=express.Router()


//----------------------GET all C's---------------------
collections.get('/collections', async (req, res) => {
    try {
        const collections = await CollectionModel.find()
        res.status(200)
            .send({
                statusCode: 200,
                collections }) }
     catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error" }) }
 })

//----------------------GET---------------------

collections.get('/:userId/collections', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await UserModel.findById(userId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        collections: user.userCollection
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      });
    }
  });
  

 //----------------GETbyID----------------------

collections.get('/:userId/collections/:collectionId', async (req, res) => {
    const { userId, collectionId } = req.params;
  
    try {
      const user = await UserModel.findById(userId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        });
      }
  
      const collection = user.userCollection.find((c) => c._id.toString() === collectionId);
      if (!collection) {
        return res.status(404).send({
          statusCode: 404,
          message: "collection not found!"
        });
      }
  
      res.status(200).send({
        statusCode: 200,
        collection
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      });
    }
  });
  

//------------POST--------------------------

collections.post('/:userId/add-collection', async (req, res) => {
  const { userId } = req.params;
  const {gameTitle,gameCover,developer,publisher,genres,releaseDate,platforms} = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found!"
      });
    }

    const newCollection = new CollectionModel({
      gameTitle: gameTitle,
      gameCover: gameCover,
      developer: developer,
      publisher: publisher,
      genres: genres,
      releaseDate: releaseDate,
      platforms: platforms  });

    const savedCollection = await newCollection.save();
    user.userCollection.push(savedCollection);
    await user.save();

    res.status(201).send({
      statusCode: 201,
      message: "Collection added successfully",
      collection: savedCollection
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error"
    });
  }
});

//---------------------PATCH-------------------

collections.patch('/:userId/collections/:collectionId', async (req, res) => {
    const { userId, collectionId } = req.params;
    const {newGameTitle,newGameCover,newDeveloper,newPublisher,newGenres,newReleaseDate,newPlatforms} = req.body; // Estrai i nuovi dati del gioco dal corpo della richiesta
  
    try {
      const user = await UserModel.findById(userId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        });
      }
  
      const collection = user.userCollection.find((c) => c._id.toString() === collectionId);
      if (!collection) {
        return res.status(404).send({
          statusCode: 404,
          message: "Collection not found!"
        });
      }
  
      // Aggiorna i dati del gioco con i nuovi valori
      collection.gameTitle = newGameTitle;
      collection.gameCover = newGameCover;
      collection.developer = newDeveloper;
      collection.publisher = newPublisher;
      collection.genres = newGenres;
      collection.releaseDate = newReleaseDate;
      collection.platforms = newPlatforms;
      await collection.save();
  
      res.status(200).send({
        statusCode: 200,
        message: "Collection updated successfully",
        collection
      });
    } catch (e) {
        console.error(e);
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      });
    }
  });
  

//------------------DELETE------------------

collections.delete('/:userId/collections/:collectionId', async (req, res) => {
    const { userId, collectionId } = req.params;
  
    try {
      const user = await UserModel.findById(userId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        });
      }
  
      const collection = user.userCollection.find((c) => c._id.toString() === collectionId);
      if (!collection) {
        return res.status(404).send({
          statusCode: 404,
          message: "Collection not found!"
        });
      }
  
      // Rimuovi il gioco dal user e dal database
      user.userCollection.pull(collection);
      await collection.deleteOne();
      await user.save();
  
      res.status(200).send({
        statusCode: 200,
        message: "Collection deleted successfully"
      });
    } catch (e) {
        console.error('Error while deleting the game:', e);
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      });
    }
  });
  

module.exports=collections
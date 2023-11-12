const express=require('express')
const CollectionModel = require('../models/collection')
const UserModel = require('../models/user')
const verifyToken = require('../middlewares/verifyToken')
const collections=express.Router()
const multer=require('multer')
const cloudinary=require('cloudinary').v2
const {CloudinaryStorage}=require('multer-storage-cloudinary')
const crypto=require('crypto')
require('dotenv').config()


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET })

  const cloudStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
          folder: 'LightEnd05',
          format: async (req, file) => 'png',
          public_id: (req, file) => file.name }  })


const internalStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
      //posizione in cui salvare i file
      cb(null,'./public') },
  filename:(req,file,cb)=>{
      //generiamo un suffisso unico per il nostro file
      const uniqueSuffix=`${Date.now()}-${crypto.randomUUID()}`
      //recuperiamo dal tutto solo l'estensione dello stesso file
      const fileExtension=file.originalname.split('.').pop()
      //eseguiamo la callback col titolo completo
      cb(null,`${file.fieldname}-${uniqueSuffix}.${fileExtension}`) }  })

const upload=multer({storage:internalStorage})
const cloudUpload = multer({storage:cloudStorage})

//-------------------------LocalPost/Cover-----------------------------------------
collections.post('/collections/upload', upload.single('gameCover')  , async (req, res) => {
  const url = `${req.protocol}://${req.get('host')}` // http://localhost:5050
  console.log(req.file)

  try {
      const imgUrl = req.file.filename;
      res.status(200).json({ gameCover: `${url}/public/${imgUrl}` })
  } catch (e) {
      res.status(500).send({
          statusCode: 500,
          message: "Internal Server Error" })
  } })

//-----------------------CloudPost/Cover---------------------------------------------
collections.post('/collections/cloudUpload', cloudUpload.single('gameCover'), async (req, res) => {
  try {
      res.status(200).json({ gameCover: req.file.path })
  } catch (e) {
      res.status(500).send({
          statusCode: 500,
          message: "Internal Server Error" })
  } })



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
            message: "Internal Server Error" }) }  })

//----------------------GET---------------------

collections.get('/:userId/collections', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await UserModel.findById(userId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        })  }
  
      res.status(200).send({
        statusCode: 200,
        collections: user.userCollection
      });
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      }) }
  });
  

//------------POST--------------------------

collections.post('/:userId/add-collection', async (req, res) => {
  const { userId } = req.params;
  const {gameTitle,gameCover,developer,publisher,genres,releaseDate,platforms,collCreator} = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found!"
      }) }

    const newCollection = new CollectionModel({
      gameTitle,
      gameCover,
      developer,
      publisher,
      genres,
      releaseDate,
      platforms,
      collCreator  });

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
    }) }
});

//---------------------PATCH-------------------

collections.patch('/:userId/collections/:collectionId', async (req, res) => {
    const { userId, collectionId } = req.params;
    const {newGameTitle,newGameCover,newDeveloper,newPublisher,newGenres,newReleaseDate,newPlatforms,newCollCreator} = req.body; // Estrai i nuovi dati del gioco dal corpo della richiesta
  
    try {
      const user = await UserModel.findById(userId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        }) }
  
      const collection = user.userCollection.find((c) => c._id.toString() === collectionId);
      if (!collection) {
        return res.status(404).send({
          statusCode: 404,
          message: "Collection not found!"
        }) }
  
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
      }) }
  });
  

//------------------DELETE------------------

collections.delete('/:gamerId/collections/:collectionId', verifyToken, async (req, res) => {
    const { gamerId, collectionId } = req.params;
    const userId = req.user.id;
  
    try {
      const user = await UserModel.findById(gamerId).populate('userCollection');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        })  }
  
      const collection = user.userCollection.find((c) => c._id.toString() === collectionId);
      if (!collection) {
        return res.status(404).send({
          statusCode: 404,
          message: "Collection not found!"
        })  }

      if (collection.collCreator.toString() !== userId.toString()) {
        return res.status(403).send({
            statusCode: 403,
            message: "Unauthorized to delete this game"
        }) }
  
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
      })  }
  });
  
module.exports=collections
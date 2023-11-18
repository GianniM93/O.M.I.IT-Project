const express = require('express')
const PostModel = require('../models/post')
const UserModel = require('../models/user')
const validatePost = require('../middlewares/validatePost')
const posts = express.Router()
const multer=require('multer')
const cloudinary=require('cloudinary').v2
const {CloudinaryStorage}=require('multer-storage-cloudinary')
const crypto=require('crypto')
require('dotenv').config()
const verifyToken = require('../middlewares/verifyToken')


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
posts.post('/posts/upload', upload.single('cover')  , async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}` // http://localhost:5050
    console.log(req.file)

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({ cover: `${url}/public/${imgUrl}` })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error" })
    } })

//-----------------------CloudPost/Cover---------------------------------------------
posts.post('/posts/cloudUpload', cloudUpload.single('cover'), async (req, res) => {
    try {
        res.status(200).json({ cover: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal Server Error" })
    } })


    //----------------------GET---------------------

posts.get('/:userId/posts', verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId).populate('userPosts');
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found!"
      })  }

        // Popola postComments per ogni post in userPosts
    const postsWithComments = await Promise.all(
      user.userPosts.map(async (post) => {
        return PostModel.findById(post._id).populate('postComments');
      }) );

    res.status(200).send({
      statusCode: 200,
      posts: postsWithComments
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error"
    }) }
});

//----------------------GET all P's---------------------
posts.get('/posts', verifyToken,  async (req, res) => {
  const { page = 1, pageSize = 4 } = req.query
   try {
       const posts = await PostModel.find()
       .populate('postComments')
       .limit(pageSize)
       .skip((page -1) * pageSize)
       const totalPosts = await  PostModel.count()
       res.status(200)
           .send({
               statusCode: 200,
               currentPage: Number(page),
               totalPages: Math.ceil(totalPosts / pageSize),
               totalPosts,
               posts }) }
    catch (e) {
       res.status(500).send({
           statusCode: 500,
           message: "Internal Server Error" })}  })

//---------------------PATCH-------------------
posts.patch('/:gamerId/posts/:postId', verifyToken, cloudUpload.single('newCover'), async (req, res) => {
  const { gamerId, postId } = req.params;
  const {newCategory,newTitle,newCover,newValue,newUnit,newContent} = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(gamerId).populate('userPosts');
    if (!user) {
      return res.status(404).send({
        statusCode: 404,
        message: "User not found!"
      }) }

    const post = user.userPosts.find((c) => c._id.toString() === postId);
    if (!post) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post not found!"
      }) }

    if (post.postCreator.toString() !== userId.toString()) {
      return res.status(403).send({
          statusCode: 403,
          message: "Unauthorized to delete this Post"
      }) }

      if (req.file) {
        const imageUrl = req.file.path;
        newCover = imageUrl }

    // Aggiorna i dati del gioco con i nuovi valori
    if (newCategory !== undefined) post.category = newCategory;
    if (newTitle !== undefined) post.title = newTitle;
    if (newCover !== undefined) post.cover = newCover;
    if (newValue !== undefined) post.readTime.value = newValue;
    if (newUnit !== undefined) post.readTime.unit = newUnit;
    if (newContent !== undefined) post.content = newContent;
    await post.save();

    res.status(200).send({
      statusCode: 200,
      message: "Post updated successfully",
      post
    });
  } catch (e) {
      console.error(e);
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error"
    }) }
});

//-------------------------------POST-----------------------------------------------------

posts.post('/:userId/add-post', validatePost, async (req, res) => {
    const { userId } = req.params;
    const {category,title,cover,readTime,author,content,postComments,postCreator} = req.body;
  
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        })  }
  
      const newPost = new PostModel({
        category,
        title,
        cover,
        readTime:{value: readTime.value, unit: readTime.unit},
        author:{name: author.name, avatar: author.avatar},
        content,
        postComments,
        postCreator })
  
      const savedPost = await newPost.save();
      user.userPosts.push(savedPost);
      await user.save();
  
      res.status(201).send({
        statusCode: 201,
        message: "Post added successfully",
        post: savedPost
      });
    } catch (e) {
        console.error(e);
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      }) }
  });

  //------------------DELETE-------------------------------------------------

posts.delete('/:posterId/posts/:postId', verifyToken, async (req, res) => {
    const { posterId, postId } = req.params;
    const userId = req.user.id;
  
    try {
      const user = await UserModel.findById(posterId).populate('userPosts');
      if (!user) {
        return res.status(404).send({
          statusCode: 404,
          message: "User not found!"
        })   }
  
      const post = user.userPosts.find((c) => c._id.toString() === postId);
      if (!post) {
        return res.status(404).send({
          statusCode: 404,
          message: "Post not found!"
        })   }

      // Verifica che l'utente autenticato sia l'autore del commento
      if (post.postCreator.toString() !== userId.toString()) {
        return res.status(403).send({
            statusCode: 403,
            message: "Unauthorized to delete this post"
        }) }

      // Rimuovi il commento dal post e dal database
      user.userPosts.pull(post);
      await post.deleteOne();
      await user.save();
  
      res.status(200).send({
        statusCode: 200,
        message: "Post deleted successfully"
      });
    } catch (e) {
        console.error('Error while deleting Post:', e);
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error"
      })  }
  });


module.exports=posts
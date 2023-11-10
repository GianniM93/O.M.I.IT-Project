const express=require('express')
const AuthorModel=require('../models/author')
const validateAuthor = require('../middlewares/validateAuthor')
const authors=express.Router()
const bcrypt=require('bcrypt')
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
        cb(null,`${file.fieldname}-${uniqueSuffix}.${fileExtension}`) }
})

const upload=multer({storage:internalStorage})
const cloudUpload = multer({storage:cloudStorage})


//-------------------------LocalPost/Avatar-----------------------------------------
authors.post('/authors/upload', upload.single('avatar')  , async (req, res) => {
    const url = `${req.protocol}://${req.get('host')}` // http://localhost:5050
    console.log(req.file)

    try {
        const imgUrl = req.file.filename;
        res.status(200).json({ avatar: `${url}/public/${imgUrl}` })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server" })
    } })


//-----------------------CloudPost/Avatar---------------------------------------------
authors.post('/authors/cloudUpload', cloudUpload.single('avatar'), async (req, res) => {
    try {
        res.status(200).json({ avatar: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server" })
    } })

//---------------GET---------------------------------
authors.get('/authors', async(req,res)=>{
try{
    const authors=await AuthorModel.find()

    res.status(200).send({
        statusCode:200,
        authors  }) }
catch(e){
    res.status(500).send({
        statusCode:500,
        message:'Internal Server Error'  }) }
})

//---------------GETbyID---------------------------------

authors.get('/authors/byid/:authorId', async(req,res)=>{
    const{authorId}=req.params;

    try{
        const authors=await AuthorModel.findById(authorId)
        if(!authors){
            return res.status(404).send({
                statusCode: 404,
                message: "Author not found!" }) }
        res.status(200).send({
                statusCode: 200,
                authors  }) }
    catch(e){
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server" }) }
})

//------------------POST-----------------------------------------
authors.post('/authors/create', validateAuthor, async(req,res)=>{

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newAuthor=new AuthorModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        avatar: req.body.avatar,
        password: hashedPassword  })
        
    try{
        const author=await newAuthor.save()

        res.status(201).send({
            statusCode:201,
            message:"New Author Created!",
            payload: author  }) }
            
        catch(e){
            res.status(500).send({
                statusCode: 500,
                message: "Errore interno del server" }) }
})

//---------------------DELETE-----------------------------
authors.delete('/authors/delete/:authorId', async (req, res) => {
    const { authorId } = req.params;

    try {
        const author = await AuthorModel.findByIdAndDelete(authorId)
        if (!author) {
            return res.status(404).send({
                statusCode: 404,
                message: "Author not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Author deleted successfully"
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        }) }
})

//---------------------Patch-----------------------------

authors.patch('/authors/update/:authorId', cloudUpload.single('avatar'), async(req,res)=>{
    const{authorId}=req.params;
    const authorExist=await AuthorModel.findById(authorId)

    if(!authorExist){
        return res.status(404).send({
            statusCode:404,
            message:"This Author does not exist!" }) }

    try{
        const dataToUpdate=req.body;

        // Verifica se è stato caricato un file (immagine) e se sì, aggiorna l'URL dell'immagine
        if (req.file) {
            const imageUrl = req.file.path;
            dataToUpdate.avatar = imageUrl }

        const options={new:true};
        const result=await AuthorModel.findByIdAndUpdate(authorId,dataToUpdate,options)

        res.status(200).send({
            statusCode: 200,
            message: "Author updated successfully",
            result   }) }
    
    catch(e){
        console.log(e)
        res.status(500).send({
            statusCode: 500,
            message: "Server Internal Error!" }) }
})

module.exports=authors
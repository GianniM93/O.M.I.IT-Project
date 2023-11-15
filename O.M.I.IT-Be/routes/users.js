const express=require('express')
const UserModel=require('../models/user')
const validateUser = require('../middlewares/validateUser')
const users=express.Router()
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
        cb(null,`${file.fieldname}-${uniqueSuffix}.${fileExtension}`) }   })

const upload=multer({storage:internalStorage})
const cloudUpload = multer({storage:cloudStorage})


//-------------------------LocalPost/Avatar-----------------------------------------
users.post('/users/upload', upload.single('avatar')  , async (req, res) => {
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
users.post('/users/cloudUpload', cloudUpload.single('avatar'), async (req, res) => {
    try {
        res.status(200).json({ avatar: req.file.path })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server" })
    } })

//---------------GET---------------------------------
users.get('/users', async(req,res)=>{
try{
    const users=await UserModel.find()
       .populate('userCollection')
       .populate('userPosts')
       .populate('userComments')
    res.status(200).send({
        statusCode:200,
        users  }) }
catch(e){
    res.status(500).send({
        statusCode:500,
        message:'Internal Server Error'  }) }  })

//------------------POST-----------------------------------------
users.post('/users/create', validateUser, async(req,res)=>{

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser=new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: req.body.nickName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        avatar: req.body.avatar,
        password: hashedPassword,
        userCollection: req.body.userCollection,
        userPosts: req.body.userPosts,
        userComments: req.body.userComments })
        
    try{
        const user=await newUser.save()

        res.status(201).send({
            statusCode:201,
            message:"New Account Created!",
            payload: user  }) }
            
        catch(e){
            res.status(500).send({
                statusCode: 500,
                message: "Errore interno del server" }) }
})

//---------------------DELETE-----------------------------
users.delete('/users/delete/:userId', verifyToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found or already deleted!"
            }) }

        res.status(200).send({
            statusCode: 200,
            message: "User deleted successfully"
        })

    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        }) }
})

//---------------------Patch-----------------------------

users.patch('/users/update/:userId', verifyToken, cloudUpload.single('avatar'), async(req,res)=>{
    const{userId}=req.params;
    const userExist=await UserModel.findById(userId)

    if(!userExist){
        return res.status(404).send({
            statusCode:404,
            message:"This User does not exist!" }) }

    try{
        const dataToUpdate=req.body;

        if (dataToUpdate.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(dataToUpdate.password, salt);
            dataToUpdate.password = hashedPassword }

        if (req.file) {
            const imageUrl = req.file.path;
            dataToUpdate.avatar = imageUrl }

        const options={new:true};
        const result=await UserModel.findByIdAndUpdate(userId,dataToUpdate,options)

        res.status(200).send({
            statusCode: 200,
            message: "User updated successfully",
            result   }) }
    
    catch(e){
        console.log(e)
        res.status(500).send({
            statusCode: 500,
            message: "Server Internal Error!" }) }
})

module.exports=users
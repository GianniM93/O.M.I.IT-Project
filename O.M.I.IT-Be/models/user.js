const mongoose=require('mongoose')

const UserSchema= new mongoose.Schema({
    firstName: {
        type: String,
        required: true },
    lastName: {
        type: String,
        required: true },
    nickName: {
        type: String,
        required: true },
    email: {
        type: String,
        required: true },
    birthDate: {
        type: String,
        required: true },
    avatar: {
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&usqp=CAU" },
    password: {
        type: String,
        required: true },
    userCollection: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'collectionModel',
        required: false }],   
    userPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel',
        required: false }], 
    userComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentModel',
        required: false }]  
},{ timestamps: true, strict: true} )

    module.exports=mongoose.model('userModel',UserSchema,'users')

const mongoose=require('mongoose')

const CollectionSchema= new mongoose.Schema({
    gameTitle: {
        type: String,
        required: true },
    gameCover: {
        type: String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiQc9dZn33Wnk-j0sXZ19f8NiMZpJys7nTlA&usqp=CAU" },
    developer: {
        type: String,
        required: true },
    publisher: {
        type: String,
        required: false },
    genres: {
        type: String,
        required: false },
    releaseDate: {
        type: String,
        required: true },
    platforms: {
        type: String,
        required: true },
    collCreator: {
        type: String,
        required: false }
    },{ timestamps: true, strict: true} )

    module.exports=mongoose.model('collectionModel',CollectionSchema,'u-collection')
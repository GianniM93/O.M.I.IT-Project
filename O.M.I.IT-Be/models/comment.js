const mongoose=require('mongoose')

const CommentSchema= new mongoose.Schema({
    comm: {
        type: String,
        required: true },
    rate: {
        type: Number,
        required: false },
    commAuthor: {
        type: String,
        required: true },
    },{ timestamps: true, strict: true} )

    module.exports=mongoose.model('commentModel',CommentSchema,'u-comments')
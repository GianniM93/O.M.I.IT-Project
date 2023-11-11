const express=require('express')
const mongoose=require('mongoose');
require('dotenv').config()
const PORT=5050;
const postsRoute=require('./routes/posts');
const usersRoute=require('./routes/users');
const commentsRoute=require('./routes/comments');
const collectionsRoute=require('./routes/collections');
const emailRoute=require('./routes/sendEmail')
const loginRoute=require('./routes/login')
const githubRoute=require('./routes/github')
const logger=require('./middlewares/logger')
const cors=require('cors')
const path=require('path')

const app=express(); /*permette di usare i metodi di express*/

app.use('/public', express.static(path.join(__dirname,'./public')))

/*middleware/parser json*/
app.use(cors())
app.use(express.json())
app.use(logger)

/*Routes*/
app.use('/',postsRoute)
app.use('/',usersRoute)
app.use('/',commentsRoute)
app.use('/',collectionsRoute)
app.use('/',emailRoute)
app.use('/',loginRoute)
app.use('/',githubRoute)


mongoose.connect(process.env.MONGODB_URL, {
useNewUrlParser: true,
useUnifiedTopology: true, })

const db=mongoose.connection;
db.on('error', console.error.bind(console,'Error during db connection :('))
db.once('open',()=>{
    console.log('Database successfully Connected ^__^')
})

app.listen(PORT,()=>console.log(`Server up and running on port ${PORT}`))

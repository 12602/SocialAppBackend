
const express=require('express');
const cookieParser=require("cookie-parser")
const db=require('./config/database')
const cors=require("cors")
//importing rotes

//const post=require('./routes/Post')
const user=require("./routes/User");
const post=require("./routes/Post")
const PORT=4000
db.connectDatabase();


const app=express()

//using middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(cors())
//using routes
//post routes

//user routes
app.use("/api",user);

app.use("/api",post);



app.listen(PORT,()=>{


    console.log(`Server is running on ${PORT}`)
})

module.exports=app
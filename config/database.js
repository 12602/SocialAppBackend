const mongoose = require('mongoose')
const DB='mongodb://127.0.0.1/social';

exports.connectDatabase=()=>{
 
    mongoose.connect(DB).
  then((con)=>console.log(`Databse Connected: ${con.connection.host}`)).
catch((err)=>console.log("error"+err))



}






const User=require('../models/User')
const jwt=require("jsonwebtoken")

const JWT_SECRET_KEY='JATINSHARMA'
const isAuthenticated=async(req,resp,next)=>{
const token=req.header('auth-token');
       
    if(!token){

      return resp.status(401).send({error:"Please authenticate using a valid token"})
    
    }
   try {
    const data=jwt.verify(token,JWT_SECRET_KEY);
    
    const user=await User.findOne({_id:data.user});
   
    req.user=user;
    next();
   } catch (error) {
    
    console.log('Error while authenticating'+error);

    return resp.status(401).send({error:"Please authenticate the user"});
    
    
   }
  }

  module.exports=isAuthenticated;
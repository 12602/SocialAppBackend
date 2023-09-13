const mongoose=require('mongoose')
const jwt=require("jsonwebtoken")
const bcrypt=require('bcrypt')
const secret="Jatin"
const crypto=require("crypto")
const UserSchema=new mongoose.Schema({

  name:{
    type:String,
    required:[true,"Please enter a name"],

  },
  avatar:{
    public_id:String,
    url:String
  },
  email:{

    type:String,
    required:[true,"Please enter a email"],
    unique:[true,"Email already exist"]

  },
  password:{
    type:String,
    required:[true,"Please enter a password"],
    minlength:[6,"Password must be at least 6 character"],
     select:false
  },
  posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
  ],
  followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
  ],
  following:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
  ],
  resetPasswordToken:String,
  resetPasswordExpire:Date


})


//hash the password before saving 
UserSchema.pre("save",async function(next){
   
    if(this.isModified("password"))
  this.password=await bcrypt.hash(this.password,10);
  next();
})


//mathcing password 

UserSchema.methods.matchPassword=async function(password){
   
  return await bcrypt.compare(password,this.password);
}

//Generatin token

UserSchema.methods.generateToken=function(){

    return jwt.sign({_id:this._id},secret)



}


UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports=mongoose.model("User",UserSchema)
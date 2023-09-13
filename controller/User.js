const User = require("../models/User");
const Post=require("../models/Post")
const jwt = require("jsonwebtoken");
const JWT_SERCRET_KEY='JATINSHARMA'
exports.register = async (req, res) => {

    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exist" });

        }

        user = await User.create({
            name,
            email,
            password,
            avatar: { public_id: "smaple id", url: "smaple url" }
        });


        //login also while registering
        const token =jwt.sign({"user":user},JWT_SERCRET_KEY); 
        return res.status(200).send({"success":true, "token":token,"message":"User saved sucesfully!!!" });

    
       
    } catch (error) {

        res.status(500).json({ success: false, message: error.message })
    }
}


//login
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
     
        const user = await User.findOne({ email }).select('+password').populate("followers following posts");
        //if user not exist
        if (!user) {

            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }


        const isMatch = await user.matchPassword(password);
     
        if (!isMatch) {
          console.log(isMatch);

            return res.status(400).json({ success: false, message: "Incorrect password" });
        }

       
        
    const token =jwt.sign({"user":user._id},JWT_SERCRET_KEY); 

   return res.status(200).json({'token':token,"message":'User login sucesfully!!!',"user":user });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }

}


//following/follow

exports.followUser = async (req, res) => {
  try {
   
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);
    console.log(userToFollow,loggedInUser)

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (loggedInUser.following.includes(userToFollow._id)) {
      const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexfollowing, 1);
      userToFollow.followers.splice(indexfollowers, 1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User Unfollowed",
      });
    } else {
      loggedInUser.following.push(userToFollow._id);
      userToFollow.followers.push(loggedInUser._id);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "User followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//logout

exports.logout = async (req, res) => {

    try {

        res.status(200).cookie("token", null, { expires: new Date(Date.now()) }).json({ success: true, message: "LogOut Sucesfully!!" })

    } catch (error) {

        return res.status(500).json({ success: false, message: error.message })
    }
}


//update password

exports.updatePassword = async (req, res) => {


    try {
        const user = await User.findById(req.user._id).select("password");
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Please provide password!!" })
        }
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Old Password Not matched" })
        }
        user.password = newPassword;
        await user.save();
        return res.status(201).json({ success: true, message: "Password Changed Succefully!!!" })

    } catch (error) {
        return res.status(201).json({ succes: false, message: error.message })
    }
}



//update profiile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email } = req.body;


        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        await user.save();
        res.status(200).json({ success: true, message: "Profile Updated Succesfully!!!" })
    } catch (error) {

        res.status(400).json({ succes: false, message: error.message })
    }

}

exports.deleteMyProfile = async (req, res) => {

    try {
         
        const user = await User.findById(req.user._id);
 
        const posts = user.posts;

        const followers=user.followers;
        const following=user.following;
        const temp=user.following;
        const userId=user._id;

  
        //delete all the post associated with the user

        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove();
        }

     


        //remove User from followrs
        for(let i=0;i<followers.length;i++)
        {
            const follower=await User.findById(following[i]);
          const index=  follower.following.indexOf(userId);
        
          follower.following.splice(index,1);
            console.log("hello!!"+index)
        await  follower.save()
        
    }

       //remove all following follower
       for(let i=0;i<following.length;i++)
       {
           const follows=await User.findById(followers[i]);
         const index=  follows.followers.indexOf(userId);
       
         follows. followers.splice(index,1);
           console.log("hello!!"+index)
       await  follows.save()
       
   }

    await user.remove();
           //logout user after remove the profile
     res.cookie("token", null, { expires: new Date(Date.now()),httpOnly:true }).json({ success: true, message: "Pofile Deleted!!" })
    
    
 

    } catch (error) {
       return  res.status(400).json({ success: false, message:error.message })
    }
}



exports.myProfile=async(req,res)=>{
   try {
       
    const user = await User.findById(req.user._id).populate("posts following followers");
  res.status(200).json({succes:true,user})

   } catch (error) {
    return  res.status(400).json({ success: false, message:error.message });
}
}

exports.getUserProfile=async(req,res)=>{

    try {
        const user = await User.findById(req.params.id).populate(
          "posts followers following"
        );
    
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
    
        res.status(200).json({
          success: true,
          user,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
}


exports.getAllUsers=async(req,res)=>{

    try {
        const users=await User.find({});
            console.log(users);
        res.status(200).json({success:true,users})
        
    } catch (error) {
      console.log(error)
      
        res.status(500).json({success:false,message:error.message});        
    }
}





//foreget password

exports.forgotPassword = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const resetPasswordToken = user.getResetPasswordToken();
  
      await user.save();
  
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/password/reset/${resetPasswordToken}`;
  
      const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;
  
      try {
        await sendEmail({
          email: user.email,
          subject: "Reset Password",
          message,
        });
  
        res.status(200).json({
          success: true,
          message: `Email sent to ${user.email}`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
  
        res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  //reset password
  exports.resetPassword = async (req, res) => {
    try {
      const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
  
      const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Token is invalid or has expired",
        });
      }
  
      user.password = req.body.password;
  
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Password Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  



  exports.getPostsById=async(req,resp)=>{
    try {
      const id=req.params.id;
      const user=await User.findById(id);
      const posts=[];
      for(let i=0;i<user.posts.length;i++){
        const post=await Post.findById(user.posts[i]).populate('likes comments.user owner');
       posts.push(post);
      }
  
  
      return resp.status(200).json({success:'true',posts:posts });
        
      
    } catch (error) {
      console.log(error)
      return resp.status(500).json({success:'false',"message":'Internal Server Error'});
      
      
    }
  }
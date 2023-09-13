
const Post=require("../models/Post")
const User=require("../models/User")
exports.createPost=async(req,res)=>{
     
  const {caption,url}=req.body;
  
  console.log("caption",caption);
  console.log("url",url);
  
  
  try {

     const newPostData={
        caption:req.body.caption,
        image:{
            public_id:"",
            url:url
        },
        owner:req.user._id
     
     }

     const newpost=await Post.create(newPostData)
    const user=await User.findById(req.user._id);
   //pushing the push in user also
    user.posts.push(newpost._id);
    await user.save();
    console.log(newpost,user);
    res.status(201).json({
      success:true,
      message:"Post Created Succesfully!!!",
    newpost})

  } catch (error) {
  console.log(error);    
     res.status(500).json({
    success:false,
    message:error.message


    })
  }
}



exports.likeAndUnlikePost=async(req,res)=>{

try {
  
  console.log(req.params.id)

const post=await Post.findById({_id:req.params.id});



   if(!post)
   {

    return res.status(500).json({success:false,json:"Post not found"});
   }
   //if user already likes the post then unlike it
   if(post.likes.includes(req.user._id))
   {

    const index=post.likes.indexOf(req.user._id);
  
  post.likes.splice(index,1);
  await post.save();
  return res.status(200).json({success:true,message:"Post is unliked"})
  }
  //like the post
  else
  {
    post.likes.push(req.user._id);
    await  post.save();
    return res.status(200).json({success:true,message:"Post is liked"})
  }




} catch (error) {
 console.log(error)
  res.status(500).json({success:false, message:"Internal server error while liking post!!!Post Id Not correct!!"})
}

}

exports.deletePost=async(req,res)=>{


  try {

    const post=await Post.findById(req.params.id);
  
    if(!post)
   {

    return res.status(500).json({success:false,message:"Post not found"});
   }
   
   if(post.owner.toString()!==req.user._id.toString()){

    return res.status(401).json({sucess:false,message:"Unauthorized"})
   }
  //deleting post
   await post.remove();
   //from user also
   //find the user by user id first
   const user=await User.findById(req.user._id);

    const index= user.posts.indexOf(req.params.id);
    user.posts.splice(index,1);
    await user.save();

res.status(200).json({success:true,message:"post is deleted!!!"})

    
  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }



}



exports.getPostOfFollowing=async(req,res)=>{

   try {

  const user=await User.findById(req.user._id);
  
  //get all details of following 
   const posts=await Post.find({
    owner:{
      $in:user.following
    }
   }).populate('owner likes comments.user')

res.status(200).json({success:true,post:posts.reverse()})

      

   } catch (error) {
    res.status(500).json({success:false,message:error.message})
   }

}




exports.updateCaption=async(req,res)=>{

   try {
      const post=await Post.findById(req.params.id);
      if(!post)
      {
        res.status(500).json({success:false,message:"Post Not Found"})
      }

      
   if(post.owner.toString()!==req.user._id.toString()){

    return res.status(401).json({sucess:false,message:"Unauthorized"})
   }

   post.caption=req.body.caption;
   await post.save();

   return res.status(401).json({sucesss:true,message:"Caption Updated Succesfully"})



   } 
   catch (error) 
   {
     return   res.status(500).json({success:false,message:error.message})
   

    }

}



exports.adddComment=async(req,res)=>{
try {
    const post=await Post.findById(req.params.id);
    if(!post)
    {
      
        res.status(500).json({success:false,message:"Post Not Found"})     
    }
    
    let commentIndex=-1;
  
//checking if comment already exist    
post.comments.forEach((item,index)=>{
    
  if(item.user.toString()===req.user._id.toString())
  {

    commentIndex=index;
  
  }
})

   if(commentIndex!==-1)
   {
      post.comments[commentIndex].comment=req.body.comment;
      await post.save();
      return res.status(200).json({success:true,message:"Comment Updated"})
   }
   else
   {
   
    post.comments.push({
      user:req.user._id,
      comment:req.body.comment
      
     })
      await post.save();
      return res.status(200).json({success:true,message:"Comment Added Sucefully!!!"})
    
    
    }


  } 
catch (error) {
   res.status(200).json({success:false,message:error.message})
}

}




exports.deleteComment=async(req,res)=>{

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Checking If owner wants to delete

    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId === undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected Comment has deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Comment has deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.getAllPosts=async(req,resp)=>{
   try {
    const allPost=await Post.find({});
  return resp.status(200).json({success:'true',posts:allPost });
    
   } catch (error) {
  console.log(error)
    return resp.status(500).json({success:'false',"message":'Internal Server Error'});
    
   }
  

}

exports.getMyPosts=async(req,resp)=>{
  try {
    const id=req.user._id;
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
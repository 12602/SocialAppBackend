const express=require('express')
const { createPost, likeAndUnlikePost, deletePost, getPostOfFollowing, updateCaption, adddComment, deleteComment, getAllPosts, getMyPosts } = require('../controller/Post')
const { register, login } = require('../controller/User')
const isAuthenticated= require('../middlewares/auth')

const router=express.Router()
//first authenticated then create post
router.route('/post/upload').post(isAuthenticated,createPost)


router.route("/posts/:id").get(isAuthenticated,likeAndUnlikePost).delete(isAuthenticated,deletePost).put(isAuthenticated,updateCaption)


router.route("/posts").get(isAuthenticated,getPostOfFollowing)

router.route("/posts/comment/:id").put(isAuthenticated,adddComment).delete(isAuthenticated,deleteComment);


router.route("/getAllPosts").get(isAuthenticated,getAllPosts);
router.route("/myPosts" ).get(isAuthenticated,getMyPosts)


module.exports=router;
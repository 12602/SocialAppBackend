const express=require('express')
const { createPost } = require('../controller/Post')
const { register, login, followUser, logout, updatePassword, updateProfile, deleteMyProfile, myProfile, getUserProfile,getAllUsers, forgotPassword, getPostsById} = require('../controller/User')


const isAuthenticated= require('../middlewares/auth')
const router=express.Router()

router.route('/user/register').post(register)


router.route('/user/login').post(login)

router.route('/user/logout').get(logout)
router.route("/user/follow/:id").get(isAuthenticated,followUser)

router.route("/user/update/password").put(isAuthenticated,updatePassword)

router.route("/user/update/profile").put(isAuthenticated,updateProfile)

router.route("/user/delete/me").delete(isAuthenticated,deleteMyProfile)
//get login user profile
router.route("/user/profile").get(isAuthenticated,myProfile)
router.route("/user/:id").get(isAuthenticated,getPostsById)
//get other user profile
router.route("/user/getUser/:id").get(isAuthenticated,getUserProfile)
router.route("/users").get(isAuthenticated,getAllUsers)

router.route("/forgot/password").post(isAuthenticated,forgotPassword)

module.exports=router
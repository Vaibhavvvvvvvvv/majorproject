const express = require("express")
const router = express.Router()
const passport = require("passport")

const wrapAsync = require("../utils/wrapAsync.js")
const {saveRedirect} = require("../middlewre.js") 
const userController = require("../controllers/userController");


router.get("/signup", userController.getUser)

router.post("/signup",wrapAsync(userController.postUser))

//login
router.get("/login", userController.loginUser);

router.post("/login", saveRedirect, passport.authenticate("local", {
   failureRedirect: "/login",failureFlash: true
}),userController.logUser);

//logout
router.get("/logout",userController.logoutUser)

module.exports = router
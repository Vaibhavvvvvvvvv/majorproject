const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username})
    const registeredUser = await User.register(newUser,password)
    console.log(registeredUser)
    req.flash("success","WELCOME TO WANDERLUST!")
    res.redirect("/listings")
}catch(e){
   req.flash("error",e.message)
   res.redirect("/signup")
}
}))

//login
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    res.redirect("/listings");
});

module.exports = router
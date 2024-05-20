const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require("ejs-mate");
const path = require("path"); 
const methodOverride = require("method-override")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")
const listings = require("./routes/listing.js")
const review = require("./routes/review.js")


//middleware
app.set("view engine", "ejs"); // Ensure consistent spacing and syntax
app.set("views", path.join(__dirname, "views")); // Corrected the code for setting views path
app.use(express.urlencoded({ extended: true })); // Corrected syntax
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);

//mongo connection
const Mongo_url=('mongodb://127.0.0.1:27017/wanderlust')
main()
.then((res)=>{
    console.log("connection success")
})
.catch((err)=>{
    console.log(err)
})
async function main(){
 await mongoose.connect(Mongo_url)
}


//session,cookies and flash
//session and cookies
const sessionOption ={
    secret : "tony_stark",
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
       httpOnly:true,
    }
}

app.use(session(sessionOption))
app.use(flash())
app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    next()
})

//Route
app.use("/listings" , listings);
app.use("/listings/:id/reviews" , review);


app.get('/',(req,res)=>{
    res.send("i am root")
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
})

app.use((err, req, res, next) => { // Make sure `err` is the first parameter
    let { status =500, message="somthing went wrong!" } = err;
    // res.render("err.ejs" ,{err})
    res.status(status).send(message);
});


app.listen(3000,()=>{
    console.log("app is listening")
})
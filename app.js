const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require("ejs-mate");
const path = require("path"); 
const methodOverride = require("method-override")
const ExpressError = require("./utils/ExpressError.js")

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
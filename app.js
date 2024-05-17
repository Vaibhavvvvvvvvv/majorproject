const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")
const ejsMate = require("ejs-mate");
const path = require("path"); 
const methodOverride = require("method-override")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema, reviewSchema} = require('./schema.js');




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


// server side validation middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
    next()
}}
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

//Route
app.get('/',(req,res)=>{
    res.send("i am root")
})

//Index route
app.get("/listings", (req, res) => {
    // Fetch the listings from the database
     Listing.find({})
        .then((listings) => {
            // Render the EJS template with `allList`
            res.render("listings/index.ejs", { allList: listings });
        })
        .catch((err) => {
            console.error("Error fetching listings:", err);
            res.status(500).send("Internal Server Error");
        });
});

//new listings form
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})


//create route
app.post("/listings",validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
 let {id} = req.params
  const listing = await Listing.findById(id).populate("reviews")
  res.render("listings/show.ejs",{listing})
}))

//edit 
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
        const { id } = req.params; 
        const listing = await Listing.findById(id); 
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit.ejs", { listing });
        
}));


//update 
app.put("/listings/:id",validateListing,wrapAsync(async (req, res) => {  
    const { id } = req.params; // Extracts the ID from the URL
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body }, // Use the full request body or req.body.listing based on your data structure
            { new: true, runValidators: true } // Return the updated document and validate
        );
        if (!updatedListing) {
            // If the listing doesn't exist, return a 404 status
            return res.status(404).send("Listing not found");
        }
        res.redirect("/listings"); // Redirects to the listing index after updating
    
}));

//delete 
app.delete('/listings/:id',wrapAsync(async (req,res)=>{
    let {id} = req.params
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted)
    res.redirect('/listings');
}))

//review
//post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));
//delete 
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async( req,res)=>{
    let {id , reviewId}= req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findById(reviewId)

    res.redirect(`/listings/${id}`)
}))

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
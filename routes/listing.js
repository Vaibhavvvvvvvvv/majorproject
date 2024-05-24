const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema} = require('../schema.js');
const Listing = require("../models/listing.js")
const {isLoggedIn} = require("../middlewre.js")

// server side validation middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index route
router.get("/", (req, res) => {
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
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
})


//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing Created")
    res.redirect("/listings");
}));

//show route
router.get("/:id",wrapAsync(async(req,res)=>{
 let {id} = req.params
  const listing = await Listing.findById(id).populate("reviews")
  if(!listing){
    req.flash("error","SORRY NO LIST FOUND")
    res.redirect("/listings")
  }
  res.render("listings/show.ejs",{listing})
}))

//edit 
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
        const { id } = req.params; 
        const listing = await Listing.findById(id); 
        // if (!listing) {
        //     return res.status(404).send("Listing not found");
        // }
        if(!listing){
            req.flash("error","SORRY NO LIST FOUND")
            res.redirect("/listings")
          } 
        res.render("listings/edit.ejs", { listing });
        
}));


//update 
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req, res) => {  
    const { id } = req.params; // Extracts the ID from the URL
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing }, // Use the full request body or req.body.listing based on your data structure
            { new: true, runValidators: true } // Return the updated document and validate
        );
        if (!updatedListing) {
            // If the listing doesn't exist, return a 404 status
            return res.status(404).send("Listing not found");
        }
        req.flash("success","Modified")
        res.redirect("/listings"); // Redirects to the listing index after updating
    
}));

//delete 
router.delete('/:id',isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted)
    req.flash("success","DELETED")
    res.redirect('/listings');
}))
module.exports = router
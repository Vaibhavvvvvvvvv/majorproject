const express = require("express")
const router = express.Router({mergeParams:true})
const Listing = require("../models/listing.js")
const Review = require("../models/review.js")
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require('../schema.js');


// server side validation middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        next(new ExpressError(400, errMsg));
    } else {
        next();
    }
};

//review
//post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","REVIEW SUBMMITED")
    res.redirect(`/listings/${listing._id}`);
}));

//delete 
router.delete("/:reviewId" , wrapAsync(async( req,res)=>{
    let {id , reviewId}= req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findById(reviewId)
    req.flash("success","REVIEW DELETED")
    res.redirect(`/listings/${id}`)
}))

module.exports = router
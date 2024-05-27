const Listing = require("../models/listing.js")
const Review = require("../models/review.js")

module.exports.postReviewRoute = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.log(review.author)
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash("success","REVIEW SUBMMITED")
    res.redirect(`/listings/${listing._id}`);
}


module.exports.destroyReviewRoute = async( req,res)=>{
    let {id , reviewId}= req.params
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findById(reviewId)
    req.flash("success","REVIEW DELETED")
    res.redirect(`/listings/${id}`)
}
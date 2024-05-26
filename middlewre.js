const ExpressError = require("./utils/ExpressError.js")
const { listingSchema} = require('./schema.js');
const Listing = require("./models/listing.js")
const Review = require("./models/review.js")

module.exports.isLoggedIn = (req,res,next)=>{
// console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","user must be logged in");
    return res.redirect("/login")
 }
 next()
}


module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params; 
    let listing = await Listing.findById(id)
     if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error","you dont have permission to edit")
        return res.redirect(`/listings/${id}`)   
    }
    next()
}


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id,reviewId } = req.params; 
    let review = await Review.findById(reviewId)
     if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error","you dont have permission to Delete")
        return res.redirect(`/listings/${id}`)   
    }
    next()
}
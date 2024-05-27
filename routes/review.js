const express = require("express")
const router = express.Router({mergeParams:true})
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema} = require('../schema.js');
const {isLoggedIn, isReviewAuthor} = require("../middlewre.js")
const reviewController = require("../controllers/review.js")

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

//post route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.postReviewRoute));

//delete 
router.delete("/:reviewId" , isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReviewRoute))

module.exports = router
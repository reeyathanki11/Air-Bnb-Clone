const express=require("express");
const router= express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Review = require("../model/review.js");
const Listing=require("../model/listing.js");
const {isLoggedIn,isOwner,validateReview,isReviewAuthor}=require("../middleware.js");
const reviewControllers=require("../controllers/reviews.js");

// Review add
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewControllers.createReview));
// review-delete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewControllers.deleteReview));

module.exports=router;
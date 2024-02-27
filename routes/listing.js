const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.postNewListing));


// add
router.get("/new", isLoggedIn,(listingController.addNewListing));

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));






// editpage
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));


module.exports = router;

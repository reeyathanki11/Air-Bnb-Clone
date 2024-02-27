const Listing=require("../model/listing");


module.exports.index=async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }

module.exports.addNewListing= (req, res, err) => {
    res.render("listings/new.ejs");
  }


module.exports.show=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
      .populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listing) {
      req.flash("error", "listing is not exists!!!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }

  module.exports.postNewListing=async (req, res, next) => {
    if (!req.body.listing) {
      next(new ExpressError(400, "please enter valid data!!!"));
    }
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    if (!newListing.title) {
      next(new ExpressError(400, "please enter valid title!!!"));
    }
    if (!newListing.description) {
      next(new ExpressError(400, "please enter valid description!!!"));
    }
    if (!newListing.price) {
      next(new ExpressError(400, "please enter valid price!!!"));
    }
    if (!newListing.location) {
      next(new ExpressError(400, "please enter valid location!!!"));
    }
    if (!newListing.country) {
      next(new ExpressError(400, "please enter valid country!!!"));
    }
    newListing.owner = req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "new listing is created!");
    res.redirect("/listings");
  }


  module.exports.editForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing is not exists!!!");
      res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing ,originalImageUrl});
  }

module.exports.updateListing=async (req, res) => {
    if (!req.body.listing) {
      next(new ExpressError(400, "please enter valid data!!!"));
    }
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    req.flash("success", " listing is updated!!");
    res.redirect(`/listings/${id}`);
    }
  }

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing is deleted!");
    res.redirect("/listings");
  }
if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}



const express=require("express");
const app=express();
const port=8080;
const mongoose = require('mongoose');
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const Listing=require("./model/listing.js");
const ejsMate = require('ejs-mate');
app.engine("ejs",ejsMate);
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require('express-session')
const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/user.js");

main().then(()=>{
    console.log("connected sucessfully!")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const sessionOptions={
    secret: 'mysupersecretcode',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true,
    }
}

// app.get("/",(req,res)=>{
//     res.send("working");
// })
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error"); 
    res.locals.currentUser=req.user;
    next();
})

// app.get("/demo",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student",
//     })

//     let newUser=await User.register(fakeUser,"hello-world");
//     res.send(fakeUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!!"));
})

app.use((err,req,res,next)=>{
    let {status=500,message="some error occured!"}=err;
    res.status(status).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log("object");
})



// main route
// app.get("/listings",wrapAsync(async (req,res)=>{
//     let allListings= await Listing.find({});
//     res.render("listings/index.ejs",{allListings});
// }));

// // add
// app.get("/listings/new",(req,res,err)=>{
//     res.render("listings/new.ejs");
// });

// // showroute
// app.get("/listings/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let listing=await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing});
// }));

// // post/createroute
// app.post("/listings",wrapAsync(async(req,res,next)=>{
//     if(!req.body.listing){
//         next(new ExpressError(400,"please enter valid data!!!"));
//     }
//     const newListing= new Listing(req.body.listing);
//     if(!newListing.title){
//         next(new ExpressError(400,"please enter valid title!!!"));
//     }
//     if(!newListing.description){
//         next(new ExpressError(400,"please enter valid description!!!"));
//     }
//     if(!newListing.price){
//         next(new ExpressError(400,"please enter valid price!!!"));
//     }
//     if(!newListing.location){
//         next(new ExpressError(400,"please enter valid location!!!"));
//     }
//     if(!newListing.country){
//         next(new ExpressError(400,"please enter valid country!!!"));
//     }

//     await newListing.save();
//     res.redirect("/listings");
// }));

// // editpage
// app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
// }));


// // updateroute
// app.put("/listings/:id",wrapAsync(async(req,res)=>{
//     if(!req.body.listing){
//         next(new ExpressError(400,"please enter valid data!!!"));
//     }
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect("/listings");
// }));


// // deleteroute
// app.delete("/listings/:id",wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }));

// // Review add
// app.post("/listings/:id/reviews",validateReview,wrapAsync(async (req,res)=>{
//     let listing=await Listing.findById(req.params.id);
//     let newReview= new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
    
//     res.redirect(`/listings/${listing._id}`);
// }));
// // review-delete
// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }))

// //validate listing!
// const validateListing=(req,res,next)=>{
//     let {error}= listingSchema.validate(req.body);
//     if(error){
//         let errMsg=error.details.map((el)=>el.message).join(" ");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// };
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review =require("./review");

const listingSchema=new  Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        // default:"https://unsplash.com/photos/a-person-standing-at-the-entrance-to-a-cave-kXbit_yx8t4",
        // type:String,
        // set: (v)=> v ===" "? "https://unsplash.com/photos/a-person-standing-at-the-entrance-to-a-cave-kXbit_yx8t4":v,
        url:String,
        filename:String,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})

let Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
const mongoose = require('mongoose');
const Listing=require("../model/listing.js");
const initData=require("./data.js");

main().then(()=>{
    console.log("connected sucessfully!")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"65a4cc8ab81cbc9885477ad1"}))
    await Listing.insertMany(initData.data);
    console.log("object");
}

initDB();
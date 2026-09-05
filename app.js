const express= require("express");
const app= express();
const mongoose= require("mongoose");
const ejsMate= require("ejs-mate");

app.use(express.json());
const Listing= require("./models/listing.js");

const path = require("path");
const methodOverride = require("method-override");

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then(()=>{
    console.log("connected to database successfully");
})
.catch((error)=>{
    console.log(error);
});

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


//INDEX ROUTE
app.get("/listings",async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});
//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//CREATE ROUTE
app.post("/listings",async(req,res)=>{
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

});

// EDIT ROUTE
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
// UPDATE ROUTE
app.put("/listings/:id",async(req,res)=>{
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

app.get("/",(req,res)=>{
    res.send("hii , i am root server");
});
app.listen(8080,(req,res)=>{
    console.log("sever started");
});
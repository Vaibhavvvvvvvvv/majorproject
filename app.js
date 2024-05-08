const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require("./models/listing.js")
const ejsMate = require("ejs-mate");
const path = require("path"); // Corrected the `require` statement
const methodOverride = require("method-override")

app.set("view engine", "ejs"); // Ensure consistent spacing and syntax
app.set("views", path.join(__dirname, "views")); // Corrected the code for setting views path
app.use(express.urlencoded({ extended: true })); // Corrected syntax
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);

//mongo connection
const Mongo_url=('mongodb://127.0.0.1:27017/wanderlust')
main()
.then((res)=>{
    console.log("connection success")
})
.catch((err)=>{
    console.log(err)
})
async function main(){
 await mongoose.connect(Mongo_url)
}

//Route
app.get('/',(req,res)=>{
    res.send("i am root")
})

//Index route
app.get("/listings", (req, res) => {
    // Fetch the listings from the database
     Listing.find({})
        .then((listings) => {
            // Render the EJS template with `allList`
            res.render("listings/index.ejs", { allList: listings });
        })
        .catch((err) => {
            console.error("Error fetching listings:", err);
            res.status(500).send("Internal Server Error");
        });
});


app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})
//create route
app.post("/listings",async(req,res)=>{
    const newListing = new Listing(req.body.listing)
    await newListing.save();
    res.redirect("/listings")
})


//show route
app.get("/listings/:id",async(req,res)=>{
 let {id} = req.params
  const listing = await Listing.findById(id)
  res.render("listings/show.ejs",{listing})
})

//update&edit 
app.get("/listings/:id/edit", async (req, res) => {
    try {
        const { id } = req.params; // Extracts the ID from the URL
        const listing = await Listing.findById(id); // Finds the listing by ID
        if (!listing) {
            // If the listing doesn't exist, return a 404 status
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit.ejs", { listing }); // Render the 'edit' view with the found listing
    } catch (error) {
        console.error("Error fetching listing:", error); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Return 500 for server errors
    }
});

app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params; // Extracts the ID from the URL
        const updatedListing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body }, // Use the full request body or req.body.listing based on your data structure
            { new: true, runValidators: true } // Return the updated document and validate
        );
        if (!updatedListing) {
            // If the listing doesn't exist, return a 404 status
            return res.status(404).send("Listing not found");
        }

        res.redirect("/listings"); // Redirects to the listing index after updating
    } catch (error) {
        console.error("Error updating listing:", error); // Log the error for debugging
        res.status(500).send("Internal Server Error"); // Return 500 for server errors
    }
});

//delete 
app.delete('/listings/:id',async (req,res)=>{
    let {id} = req.params
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted)
    res.redirect('/listings');
})



// app.get('/testlisting',(req,res)=>{
//     let sample = new Listing({
//         title : "my new villa",
//         description:"by the beach",
//         price : 3000,
//         location : "calangute , goa",
//         country : "India",
//     })
//     sample.save()
//     .then((res)=>{
//       console.log(res)
//     })
//     .catch((err)=>{
//         console.log(err)
//     })
//     res.send("success full testing")
// })



app.listen(3000,()=>{
    console.log("app is listening")
})
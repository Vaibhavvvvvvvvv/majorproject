const Listing = require("../models/listing")


module.exports.index = (req, res) => {
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
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.createList = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing Created");
    res.redirect("/listings");
}

module.exports.showRoute = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        })
        .populate('owner');
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}

module.exports.editRoute = async (req, res) => {
    const { id } = req.params; 
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error","SORRY NO LIST FOUND")
        res.redirect("/listings")
      } 
    res.render("listings/edit.ejs", { listing });
    
}


module.exports.updateRoute = async (req, res) => {  
    const { id } = req.params; // Extracts the ID from the URL
    const updatedListing = await Listing.findByIdAndUpdate(id,
            { ...req.body.listing }, // Use the full request body or req.body.listing based on your data structure
            { new: true, runValidators: true } // Return the updated document and validate
        );
        if (!updatedListing) {
            // If the listing doesn't exist, return a 404 status
            return res.status(404).send("Listing not found");
        }
        req.flash("success","Modified")
        res.redirect(`/listings/${id}`); // Redirects to the listing index after updating
    
}


module.exports.destroyRoute = async (req,res)=>{
    let {id} = req.params
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted)
    req.flash("success","DELETED")
    res.redirect('/listings');
}
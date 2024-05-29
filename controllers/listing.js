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
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"..",filename)
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename}
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
      let originalImageUrl = listing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250")
      res.render("listings/edit.ejs", { listing,originalImageUrl });
}


module.exports.updateRoute = async (req, res) => {  
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing})
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image={url,filename}
        await listing.save()
    }
    req.flash("success","Modified")
    res.redirect(`/listings/${id}`); // Redirects to the listing index after updating
    // const updatedListing = await Listing.findByIdAndUpdate(id,
    //         { ...req.body.listing }, 
    //         { new: true, runValidators: true }
    //     );
    //     if (!updatedListing) {
    //         return res.status(404).send("Listing not found");
    //     }
       
}


module.exports.destroyRoute = async (req,res)=>{
    let {id} = req.params
    let deleted = await Listing.findByIdAndDelete(id)
    console.log(deleted)
    req.flash("success","DELETED")
    res.redirect('/listings');
}
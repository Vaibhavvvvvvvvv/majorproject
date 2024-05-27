const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middlewre.js"); // server side validation middleware
const controllers = require("../controllers/listing.js")

//Index route
router.get("/", (controllers.index));

//new listings form
router.get("/new",isLoggedIn,controllers.renderNewForm)

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(controllers.createList));



// Show route
    router.get("/:id", wrapAsync(controllers.showRoute));
    

//edit 
router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(controllers.editRoute));


//update 
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(controllers.updateRoute));


//delete 
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(controllers.destroyRoute))

module.exports = router
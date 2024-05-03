const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://img0.etsystatic.com/104/0/9318045/il_fullxfull.1016506326_sbt3.jpg",
    },
    price: {
        type: Number,
        min: 0,
    },
    location: {
        type: String,
        trim: true,
    },
    country: {
        type: String,
        trim: true,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

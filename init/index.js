const mongoose = require("mongoose");
const initData = require("./Data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  // Adjust data to ensure `image` is a string
  const adjustedData = initData.data.map(listing => ({
    ...listing,
    image: listing.image.url, // Use the `url` field as the image string
  }));
  
  await Listing.deleteMany({});
  await Listing.insertMany(adjustedData); // Insert adjusted data
  console.log("Data was initialized");
};

initDB();
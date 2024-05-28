const mongoose = require("mongoose");
const initData = require("./Data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const initDB = async () => {
  // Adjust data to ensure `image` is a string and log the adjusted data
  const adjustedData = initData.data.map(listing => {
    console.log('Original listing:', listing);
    const adjustedListing = {
      ...listing,
      image: listing.image && listing.image.url ? listing.image.url : 'https://th.bing.com/th/id/R.e935816b4c7521bcf1c27b319c1bd92e?rik=ia9rc0iCI%2bpDKQ&riu=http%3a%2f%2fwww.telegraph.co.uk%2fcontent%2fdam%2fTravel%2fhotels%2fcaribbean-islands%2fst-lucia%2fvilla-beach-cottages-st-lucia-pool.jpg&ehk=RZNfNEMlx76BcHOhWwD674m1XqrtKxZWw2cpdCYsW8w%3d&risl=&pid=ImgRaw&r=0', // Use the `url` field as the image string or a default value
    };
    console.log('Adjusted listing:', adjustedListing);
    return adjustedListing;
  });
  
  await Listing.deleteMany({});
  await Listing.insertMany(adjustedData);
  console.log("Data was initialized");
};

initDB();

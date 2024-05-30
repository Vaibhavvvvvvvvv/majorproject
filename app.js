if(process.env.NODE_ENV !="production"){
    require("dotenv").config()
}
console.log(process.env.SECRET)

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbUrl = process.env.ATLAS_URL
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
// const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");

// Mongo connection
async function main() {
    await mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

main()
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((err) => {
        console.error("MongoDB connection error: ", err);
    });

    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto :{
            secret: process.env.SECRET
        },
        touchAfter: 24 * 3600,
      })
      store.on("error",()=>{
        console.log("error in mongo session store",err)
      })

    // Session and flash configuration
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

  

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//logout handler
app.use((req, res, next) => {
    res.locals.currentUser = req.user || null;
    next();
  });


// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine('ejs', ejsMate);

// Routes
const listings = require("./routes/listing");
const reviews = require("./routes/review");
const users = require("./routes/userr");

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

app.get('/', (req, res) => {
    res.redirect("/listings");
});



// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// });

// app.use((err, req, res, next) => {
//     const { status = 500, message = "Something went wrong!" } = err;
//     res.status(status).send(message);
// });

app.listen(3000, () => {
    console.log("App is listening on port 3000");
});

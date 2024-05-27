const User = require("../models/user.js")

module.exports.getUser = (req, res) => {
    res.render("users/signup.ejs")
}


module.exports.postUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "WELCOME TO WANDERLUST!")
            res.redirect("/listings")
        })
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}


module.exports.loginUser = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logUser = (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // Redirect to the stored URL or a default URL if none is found
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings")
    })
}
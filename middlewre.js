module.exports.isLoggedIn = (req,res,next)=>{
// console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","user must be logged in");
    return res.redirect("/login")
 }
 next()
}

module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
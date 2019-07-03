module.exports = function(req, res, next) 
{
    console.log("Auth check: " + req.session.logged_in)
    if (req.session.logged_in)
        next();
    else
    {
        req.session.flash = "Error, not logged in"
        res.redirect('/sign-in');
    }
    
}
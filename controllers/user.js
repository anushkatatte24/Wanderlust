const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.Signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        });
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/listings");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.Login = async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
};

module.exports.Logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You logged out successfully!");
        res.redirect("/listings");
    });
};
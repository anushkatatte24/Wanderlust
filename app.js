if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");

const db_url = process.env.ATLAS_DB_URL;



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



main()
.then((res)=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(db_url);
}

 const store = MongoStore.create({
    mongoUrl: db_url,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
 });

 store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
 });

const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires: Date.now() + 7 *24*60*60*1000,
        MaxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// demo user
// app.get("/demo",async(req,res)=>{
//     let fakeUser = new User({
//             email:"student@abc.com",
//             username:"delta-student"
//         });
//         let newUser = await User.register(fakeUser,"abc@123");
//         res.send(newUser);
// })



app.use("/listings",listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);




app.use((err,req,res,next)=>{
    let{status = 500 ,message = "something went wrong"} = err;
    res.status(status).render("error.ejs",{message}); // It's better to render an error page
});


app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});
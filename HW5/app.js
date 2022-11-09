/*
dont look into this file, not ready
*/

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');


const { appendFile } = require('fs');

mongoose.connect('mongodb://localhost:27017/yelpcamp',{
    useNewUrlParser: true,
    // useCreateIndex is deprecated
    // useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});

const app = express();
app.engine('ejs',ejsMate)


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const validateCampground = (req,res,next)=>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    //grab the campgrounds data and render 
    res.render('campgrounds/index',{campgrounds})
}))

//order of routes matters here
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})

app.post('/campgrounds',validateCampground,catchAsync(async(req,res,next)=>{

    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    
    //need to parse the req.body first
    const campground = new Campground(req.body.campground);
    await campground.save();
    //then redirect
    res.redirect(`/campgrounds/${campground._id}`);
    
}))

app.get('/campgrounds/:id',catchAsync(async(req,res,)=>{
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campground});
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground});
}))

app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>{
    //update the campground as we wish
    const{id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const{id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next) =>{
    const {statusCode = 500}= err;   
    if(!err.message) err.message = "no something went wrong"
    res.status(statusCode).render('error',{err});
})

app.listen(3000,()=>{
    console.log('serving on port 3000')
})
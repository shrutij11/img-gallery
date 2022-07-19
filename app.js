
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine=require('ejs-mate');
const Image=require('./models/image');
const methodOverride = require('method-override');
var bodyParser = require('body-parser');
const app= express();
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/img-gallery';
mongoose.connect(dbUrl,{
  
        useNewUrlParser:true,
        useUnifiedTopology:true
   
})


const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",()=> {
    console.log("Database connected");
});


app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(methodOverride('_method'));

// app.get('/', (req, res) => {
//     res.render('images/index')
// })

app.get('/mk', async (req, res) => {
    const camp = new Image({ImgName: 'newimg',ImgURL:'https://source.unsplash.com/collection/483251', ImgDetails: 'new listing'});
    await camp.save();
    res.send(camp)
})
app.get('/images', async (req, res) => {
    const images = await Image.find({});
    res.render('images/index', {images})
});
app.get('/images/new', (req, res) => {
    res.render('images/new');
});
app.post('/images', async(req, res) => {

    const image = new Image({ImgName: req.body.ImgName, ImgDetails: req.body.ImgDetails, ImgURL: req.body.ImgURL});
    await image.save();
    res.redirect(`/images/${image._id}`)
});
app.get('/images/:id', async (req, res) => {
    const image= await Image.findById(req.params.id)
    res.render('images/show', {image});
});
app.get('/images/:id/edit', async (req, res) => {
    const image= await Image.findById(req.params.id)
    res.render('images/edit', {image});
});
app.put('/images/:id', async (req, res) => {
    const {id}= req.params;
    const image= await Image.findByIdAndUpdate(id,{ImgName: req.body.ImgName, ImgDetails: req.body.ImgDetails})
    res.redirect(`/images/${image._id}`);
});
app.delete('/images/:id', async(req, res) => {
    const {id}= req.params;
    await Image.findByIdAndDelete(id);
    res.redirect('/images');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on ${port}`)
})
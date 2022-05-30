const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3002;
app.set('view engine', 'ejs');
// --------------
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// --
const blogs = [];
// --

app.get('/', (req, res) => {
    res.render('home', {homeContent: homeStartingContent, blogs: blogs});
    
});
app.get('/about', (req, res) => {
    res.render('about', {aboutContent: aboutContent});
});
app.get('/contact', (req, res) => {
    res.render('contact', {contactContent: contactContent});
});
app.get('/compose', (req, res) => {
    res.render('compose');
});
app.post('/compose', (req, res) => {
    title = req.body.title;
    post = req.body.post;
    let compose = {
        title: title,
        post: post
    }
    blogs.push(compose);
    res.redirect('/');
});

app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    id = _.lowerCase(id);
    blogs.forEach(function(element){
      let title = element.title;
      let title1  = _.lowerCase(title);
      if(id === title1) {
        res.render('post', {blogTitle: title, blogContent: element.post});
      }
      else {
          res.redirect('/notfound');
      }
    })
});

app.get('/notfound',(req, res) => {
    res.render('not-found');
} )
// --->
app.listen(port, (req, res) => {
    console.log(port);
});
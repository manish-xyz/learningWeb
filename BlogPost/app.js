const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://manish-xyz:J5rMuCcEEbc1ZuPS@cluster0.qiuc65d.mongodb.net/blogpostDB');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3002;
app.set('view engine', 'ejs');
// --------------
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// --

const blogSchema = {
    title: String,
    post: String,
};

const Blog = new mongoose.model("blog", blogSchema);

app.get('/', (req, res) => {
    
    Blog.find( (err, blogs) => {
        if(!err) {
        res.render('home', {homeContent: homeStartingContent, blogs: blogs});
        }
    } )
    
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
    title = _.toLower(req.body.title);
    post = req.body.post;
    const blog = new Blog({
        title: title,
        post: post,
    });
    blog.save();
    res.redirect('/');
});

app.get('/:id', (req, res) => {
    const id = _.toLower(req.params.id);
    if ( id !== "contact" ||id !== "about" || id !== "compose" ){
        res.redirect('/notfound');
    }

});

app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    id = _.lowerCase(id);
    Blog.find( {title: id}, (err, blog) => {
        console.log(blog.length);
        if(!err) {
            blog.forEach(function(element){
                let title = element.title;
                let title1  = _.upperFirst(title);
                if(id === title) {
                  res.render('post', {blogTitle: title1, blogContent: element.post});
                }
                else if (blog.length === 0) {
                    res.redirect('/notfound');
                }
              });
        }
        else {
            console.log(err);
        }
    });
});

app.get('/notfound',(res) => {
    res.render('not-found');
} )
// --->
app.listen(port, (req, res) => {
    console.log(port);
});
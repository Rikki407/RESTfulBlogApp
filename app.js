var express             = require("express"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    expressSanitizer    = require("express-sanitizer"),
    bodyParser          = require("body-parser");
var app  = express();
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema(
    {
        title : String,
        image : String,
        body  : String,
        created : {type: Date, default : Date.now()}
    }
);
var Blogs = mongoose.model("blogs",blogSchema);



//RESTFUL ROUTES
app.get("/",function (req, res) {
   res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function (req, res) {
    Blogs.find({},function (err, allBlogs) {
       if(err){
           console.log(err);
       }else {
           res.render("index",{blogs : allBlogs});
       }
    });
});
//CREATE
app.post("/blogs",function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blogs.create(req.body.blog,function (err, newBlog) {
      if(err){
          res.render("new");
      }else {
          res.redirect("/blogs");
      }
   });
});
//NEW ROUTE
app.get("/blogs/new",function (req, res) {
   res.render("new");
});

//SHOW ROUTE
app.get("/blogs/:id",function (req, res) {
    Blogs.findById(req.params.id,function (err , blog) {
        if(err){
            console.log(err);
        }else{
            res.render("show",{blog : blog});
        }
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blogs.findById(req.params.id,function (err , blog) {
       if(err){
           res.redirect("/blogs");
       } else{
           res.render("edit",{blog:blog});
       }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id",function (req, res) {
   Blogs.findByIdAndUpdate(req.params.id, req.body.blog, function (err , newBlog) {
       if(err){
           console.log(err);
       }else {
           res.redirect("/blogs/"+req.params.id);
       }
   })
});

//DELETE ROUTE
app.delete("/blogs/:id",function (req, res) {
    Blogs.findByIdAndRemove(req.params.id,function (err) {
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs");
       }
    });
});

app.listen(3000, function () {
   console.log("Blogs App Started on port 3000");
});
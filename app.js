var express     = require("express"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser");
var app  = express();
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

//MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema(
    {
        title : String,
        image : String,
        body  : String,
        created : {type: Date, default : Date.now()}
    }
);
var Blog = mongoose.model("blogs",blogSchema);



//RESTFUL ROUTES
app.get("/",function (req, res) {
   res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function (req, res) {
    Blog.find({},function (err, allBlogs) {
       if(err){
           console.log(err);
       }else {
           res.render("index",{blogs : allBlogs});
       }
    });
});
//CREATE
app.post("/blogs",function (req, res) {
   Blog.create(req.body.blog,function (err, newBlog) {
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
app.listen(3000, function () {
   console.log("Blog App Started on port 3000");
});
var express = require("express");
var app = express();

var hbs = require("hbs");

var imageEngine = require("./images");

app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.bodyParser());
app.use(express.static("assets"));

hbs.registerPartials(__dirname + '/views/partials');

app.get("/", function(req, res) {
    var categories = imageEngine.getCategories();
    res.render("index", {
        title: "Sassi", 
        nav: categories
    });
});

app.get("/upload", function(req, res) {
    var newJson =  {
            "id": 9,
            "category": "Mozard",
            "imageurl": "img_9.jpg",
            "title": "Barok"
    };
    var result = imageEngine.setImage(newJson);
    //console.log("set image: " + result);
    res.render("upload", {
    });
});

app.get("/image/:id", function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    var categories = imageEngine.getCategories();
    res.render("image", {
        image: image,
        nav: categories
    });
});

app.get("/api/:id", function(req, res) {
    res.send({
        name: "Bjarni Olsen",
        age: 200,
        id: req.params.id
    });
});

app.get("/:cat", function(req, res) {
    var result = imageEngine.getImagesByCategory(req.params.cat);
    var categories = imageEngine.getCategories();
    res.render("images", {
        images:result,
        currentCategory: req.params.cat,
        nav: categories
    });
});

app.listen(3000);

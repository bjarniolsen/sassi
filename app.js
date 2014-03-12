var express = require("express");
var fs = require('fs');
var app = express();
var hbs = require("hbs");
var imageEngine = require("./images");

app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.bodyParser());
app.use(express.static("assets"));

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

hbs.registerPartials(__dirname + '/views/partials');

function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		res.redirect('/login');
		//res.send('You are not authorized to view this page');
	} else {
		next();
	}
}

var spansize = function(len) {
    var size;
	if(len === 1) {
		size = 12;
	} else if(len === 2) {
		size = 6;
	} else if(len === 3) {
		size = 4;
	} else if(len > 3) {
		size = 3;
	}
    return size;
};

app.get('/login', function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
	var post = req.body;
	if (post.user == "bjarni" && post.password == "ttboy666") {
		req.session.user_id = 666;
		res.redirect("/admin");
	} else {
		res.send("Bad user/pass");
	}
});

app.get('/logout', function (req, res) {
	delete req.session.user_id;
	res.redirect('/login');
});

app.get("/", function(req, res) {
    var categories = imageEngine.getCategories();
    var result = imageEngine.getFeaturedImages();
    res.render("index", {
        title: "Sassi", 
        images: result,
        spansize: spansize(result.length),
        nav: categories
    });
});

app.get("/admin", checkAuth, function(req, res) {
    var result = imageEngine.getAllImages();
    var categories = imageEngine.getCategories();
    res.render("admin/index", {
    	images: result,
    	categories: categories,
        spansize: spansize(result.length),
        layout: 'layout/admin'
    });
});

app.post("/admin/upload", function(req, res) {
    var result = imageEngine.addImage(req, res);
	res.redirect("/admin");
});

app.post("/admin/uploads", function(req, res) {
    var result = imageEngine.addImages(req, res);
	res.redirect("/admin");
});

app.get("/admin/mute/:id", function(req, res) {
	var result = imageEngine.muteImage(req.params.id);
	res.redirect("/admin");
});

app.get("/admin/unmute/:id", function(req, res) {
	var result = imageEngine.unmuteImage(req.params.id);
	res.redirect("/admin");
});

app.get("/admin/feature/:id", function(req, res) {
	var result = imageEngine.featureImage(req.params.id);
	res.redirect("/admin");
});

app.get("/admin/unfeature/:id", function(req, res) {
	var result = imageEngine.unfeatureImage(req.params.id);
	res.redirect("/admin");
});

app.get("/admin/delete/:id", function(req, res) {
	var result = imageEngine.deleteImage(req.params.id);
	res.redirect("/admin");
});

app.post("/admin/edit/:id", function(req, res) {
	var result = imageEngine.editImage(req, res, req.params.id);
	res.redirect("/admin");
});

app.get("/admin/image/:id", function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    var categories = imageEngine.getCategories();
    res.render("admin/image", {
        image: image,
    	categories: categories,
        layout: 'layout/admin'            
    });
});

app.get("/image/:id", function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    var categories = imageEngine.getCategories();
    res.render("image", {
        image: image,
    	categories: categories,
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
        images: result,
        spansize: spansize(result.length),
        currentCategory: req.params.cat,
        nav: categories
    });
});

app.listen(19150);

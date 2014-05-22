var express = require("express");
var fs = require('fs');
var app = express();
var hbs = require("hbs");
var imageEngine = require("./images");
var helpers = require("./helpers");

app.set("view engine", "html");
app.engine("html", hbs.__express);
app.use(express.bodyParser());
app.use(express.static("assets"));

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY', cookie:{maxAge:3600000}}));

hbs.registerPartials(__dirname + '/views/partials');
console.log(__dirname);

app.get('/login', function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
	var post = req.body;
	if ( (post.user == "bjarni" && post.password == "ttboy666") || (post.user == "sassibis" && post.password == "0707mathilde") ) {
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
        spansize: helpers.spansize(result.length),
        nav: categories
    });
});

app.get("/admin", helpers.checkAuth, function(req, res) {
    var result = imageEngine.getAllImages();
    var categories = imageEngine.getCategories();
    res.render("admin/index", {
    	images: result,
    	categories: categories,
        spansize: helpers.spansize(result.length),
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

app.post("/admin/addcategory", function(req, res) {
    var result = imageEngine.addCategory(req, res);
	res.redirect("/admin");
});

app.post("/admin/addsubcategory", function(req, res) {
    var result = imageEngine.addSubCategory(req, res);
	res.redirect("/admin");
});

app.post("/admin/editcategory", function(req, res) {
    var result = imageEngine.editCategory(req, res);
	res.redirect("/admin");
});

app.post("/admin/editsubcategory", function(req, res) {
    var result = imageEngine.editSubCategory(req, res);
	res.redirect("/admin");
});

app.get("/admin/deletecategory/:id", function(req, res) {
    console.log(req.params.id);
    var result = imageEngine.deleteCategory(req.params.id);
	res.redirect("/admin");
});

app.get("/admin/deletesubcategory/:id", function(req, res) {
    var result = imageEngine.deleteSubCategory(req.params.id);
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

app.get("/admin/image/:id", helpers.checkAuth, function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    var imageCategoryNames = imageEngine.getCategoryNameByImageId(req.params.id);
    var categories = imageEngine.getCategories();
    res.render("admin/image", {
        image: image,
        category: imageCategoryNames.catName,
        subcategory: imageCategoryNames.subCatName,
    	categories: categories,
        layout: 'layout/admin'            
    });
});

app.get("/admin/:cat/:subcat", helpers.checkAuth, function(req, res) {
    var result = imageEngine.getImagesByCategory(req.params.cat, req.params.subcat);
    var subCatName = imageEngine.getSubCategoryName(req.params.cat, req.params.subcat);
	var categories = imageEngine.getCategories();
    res.render("admin/index", {
    	images: result,
    	categories: categories,
    	currentCategoryName: req.params.cat,
    	currentSubCategoryName: subCatName,
        spansize: helpers.spansize(result.length),
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

// API
app.get("/api/get_all_images", function(req, res) {
    var images = imageEngine.getAllImages();
    res.send(images);
});

app.get("/api/get_image/:id", function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    res.send(image);
});

app.get("/api/get_images_by_category/:cat", function(req, res) {
    var images = imageEngine.getImagesByCategory(req.params.cat);
    res.send(images);
});

app.get("/api/get_categories", function(req, res) {
    var categories = imageEngine.getCategories();
    res.send(categories);
});

app.get("/api/:id", function(req, res) {
    res.send({
        name: "Bjarni Olsen",
        age: 200,
        id: req.params.id
    });
});

app.get("/kontakt", function(req, res) {
	var categories = imageEngine.getCategories();
	res.render("kontakt", {
		title: "Kontakt",
        currentCategory: "kontakt",
		nav: categories
	});
});

app.get("/cv", function(req, res) {
	var categories = imageEngine.getCategories();
	res.render("cv", {
		title: "cv",
        currentCategory: "cv",
		nav: categories
	});
});

app.get("/:cat", function(req, res) {
	var categories = imageEngine.getCategories();
    res.render("category", {
        currentCategory: req.params.cat,
        nav: categories
    });
});

app.get("/:cat/:subcat", function(req, res) {
    var result = imageEngine.getImagesByCategory(req.params.cat, req.params.subcat);
    var subCatName = imageEngine.getSubCategoryName(req.params.cat, req.params.subcat);
	var categories = imageEngine.getCategories();
    res.render("images", {
        images: result,
        spansize: helpers.spansize(result.length),
        currentCategory: req.params.cat,
        currentSubCategoryId: req.params.subcat,
        currentSubCategoryName: subCatName,
        nav: categories
    });
});

app.listen(19150);

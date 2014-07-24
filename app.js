// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); // call express
var app        = express(); // define our app using express
var bodyParser = require('body-parser');
var multer  = require('multer');
//var fs = require('fs');
var hbs = require("hbs");
var imageEngine = require("./images");
var helpers = require("./helpers");
var session = require('express-session');

app.use(session({secret: '1234567890QWERTY', cookie:{maxAge:3600000}}));
app.set("view engine", "html");
app.set('views', __dirname + '/views');
app.engine("html", hbs.__express);
hbs.registerPartials(__dirname + '/views/partials');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
app.use(express.static(__dirname + '/assets'));
app.use(multer({ dest: 'assets/tmp/'}));

var port = process.env.PORT || 30052; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

router.get('/login', function (req, res) {
    res.render("login");
});

router.post("/login", function (req, res) {
	var post = req.body;
	if ( (post.user == "bjarni" && post.password == "ttboy666") || (post.user == "sassibis" && post.password == "0707mathilde") ) {
		req.session.user_id = 666;
		res.redirect("/admin");
	} else {
		res.send("Bad user/pass");
	}
});

router.get('/logout', function (req, res) {
	delete req.session.user_id;
	res.redirect('/login');
});

router.get("/", function(req, res) {
    var categories = imageEngine.getCategories();
    var result = imageEngine.getFeaturedImages();
    res.render("index", {
        title: "Sassi", 
        images: result,
        spansize: helpers.spansize(result.length),
        nav: categories
    });
});

router.get("/admin", helpers.checkAuth, function(req, res) {
    var result = imageEngine.getAllImages();
    var categories = imageEngine.getCategories();
    res.render("admin/index", {
    	images: result,
    	categories: categories,
        spansize: helpers.spansize(result.length),
        layout: 'layout/admin'
    });
});

router.post("/admin/upload", function(req, res) {
    var result = imageEngine.addImage(req, res);
	res.redirect("/admin");
});

router.post("/admin/uploads", function(req, res) {
    var result = imageEngine.addImages(req, res);
	res.redirect("/admin");
});

router.post("/admin/addcategory", function(req, res) {
    var result = imageEngine.addCategory(req, res);
	res.redirect("/admin");
});

router.post("/admin/addsubcategory", function(req, res) {
    var result = imageEngine.addSubCategory(req, res);
	res.redirect("/admin");
});

router.post("/admin/editcategory", function(req, res) {
    var result = imageEngine.editCategory(req, res);
	res.redirect("/admin");
});

router.post("/admin/editsubcategory", function(req, res) {
    var result = imageEngine.editSubCategory(req, res);
	res.redirect("/admin");
});

router.get("/admin/deletecategory/:id", function(req, res) {
    console.log(req.params.id);
    var result = imageEngine.deleteCategory(req.params.id);
	res.redirect("/admin");
});

router.get("/admin/deletesubcategory/:id", function(req, res) {
    var result = imageEngine.deleteSubCategory(req.params.id);
	res.redirect("/admin");
});

router.get("/admin/mute/:id", function(req, res) {
	var result = imageEngine.muteImage(req.params.id);
	res.redirect("/admin");
});

router.get("/admin/unmute/:id", function(req, res) {
	var result = imageEngine.unmuteImage(req.params.id);
	res.redirect("/admin");
});

router.get("/admin/feature/:id", function(req, res) {
	var result = imageEngine.featureImage(req.params.id);
	res.redirect("/admin");
});

router.get("/admin/unfeature/:id", function(req, res) {
	var result = imageEngine.unfeatureImage(req.params.id);
	res.redirect("/admin");
});

router.get("/admin/delete/:id", function(req, res) {
	var result = imageEngine.deleteImage(req.params.id);
	res.redirect("/admin");
});

router.post("/admin/edit/:id", function(req, res) {
	var result = imageEngine.editImage(req, res, req.params.id);
	res.redirect("/admin");
});

router.get("/admin/image/:id", helpers.checkAuth, function(req, res) {
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

router.get("/admin/:cat/:subcat", helpers.checkAuth, function(req, res) {
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

router.get("/image/:id", function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    var categories = imageEngine.getCategories();
    res.render("image", {
        image: image,
    	categories: categories,
        nav: categories
    });
});

// API
router.get("/api/get_all_images", function(req, res) {
    var images = imageEngine.getAllImages();
    res.send(images);
});

router.get("/api/get_image/:id", function(req, res) {
    var image = imageEngine.getImage(req.params.id);
    res.send(image);
});

router.get("/api/get_images_by_category/:cat", function(req, res) {
    var images = imageEngine.getImagesByCategory(req.params.cat);
    res.send(images);
});

router.get("/api/get_categories", function(req, res) {
    var categories = imageEngine.getCategories();
    res.send(categories);
});

router.get("/api/:id", function(req, res) {
    res.send({
        name: "Bjarni Olsen",
        age: 200,
        id: req.params.id
    });
});

router.get("/kontakt", function(req, res) {
	var categories = imageEngine.getCategories();
	res.render("kontakt", {
		title: "Kontakt",
        currentCategory: "kontakt",
		nav: categories
	});
});

router.get("/cv", function(req, res) {
	var categories = imageEngine.getCategories();
	res.render("cv", {
		title: "cv",
        currentCategory: "cv",
		nav: categories
	});
});

router.get("/:cat", function(req, res) {
	var categories = imageEngine.getCategories();
    res.render("category", {
        currentCategory: req.params.cat,
        nav: categories
    });
});

router.get("/:cat/:subcat", function(req, res) {
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

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
app.use('/', router);

app.listen(port);

// Helpers
var hbs = require("hbs");

exports.checkAuth = function(req, res, next) {
	if (!req.session.user_id) {
		res.redirect('/login');
		//res.send('You are not authorized to view this page');
	} else {
		next();
	}
}

hbs.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

exports.spansize = function(len) {
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
}

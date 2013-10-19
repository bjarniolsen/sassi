var fs = require('fs');
var file = __dirname + '/assets/json/images.json';
var images = [];
  
exports.addImage = function(req, res) {
	var newJson =  {
			"id": 11,
			"category": req.body.category,
			"imageurl": req.files.image.name,
			"title": req.body.title
	};
	// get the temporary location of the file
	var tmp_path = req.files.image.path;
	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = __dirname + '/assets/images/' + req.files.image.name;
	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function() {
		if (err) throw err;
			res.send('File uploaded to: ' + target_path + ' - ' + req.files.size + ' bytes');
		});
	});
    // Append new json to images object
    images.push(newJson);
    fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    	if (err) {
    		console.log(err);
    	} else {
    		console.log("yay!");
    	}
    });
}

exports.getLastId = function() {
}

exports.getCategories = function(req, res) {
    var arr = {};
    for ( var i=0; i < images.length; i++ ) {
        arr[images[i]['category']] = images[i];
    }

    var result = [];
    for ( key in arr ) {
        result.push(arr[key]);
    }
    return result;

    /*res.partial("nav", {
    layout: false,
    nav: result
    });*/
}

exports.getImagesByCategory = function(cat) {
    var results = [];
    for(var i=0; i < images.length; i++) {
        if(images[i].category == cat) {
            results.push(images[i]);
        }
    }
    return results;
}

exports.getImage = function(id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            return images[i];
        }
    }
}

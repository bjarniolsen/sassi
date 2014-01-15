var fs = require('fs');
var im = require('imagemagick');
var ncp = require('ncp');
var file = __dirname + '/assets/json/images.json';
var images = [];

fs.readFile(file, 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}
	images = JSON.parse(data);
});
  
exports.addImage = function(req, res) {
	var newId = (images.length > 0) ? (images[images.length-1].id + 1) : 0;
	var category = req.body.newcategory ? req.body.newcategory : req.body.category; 
	var newJson =  {
			"id": newId,
			"category": category,
			"imageurl": req.files.image.name,
			"title": req.body.title,
			"description": req.body.description,
			"featured": req.body.featured
	};
	// get the temporary location of the file
	var tmp_path = req.files.image.path;
	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = __dirname + '/assets/images/orig/' + req.files.image.name;
	var image_large = __dirname + '/assets/images/large/' + req.files.image.name;
	var thumb_large = __dirname + '/assets/images/thumb/large/' + req.files.image.name;
	var thumb_medium = __dirname + '/assets/images/thumb/medium/' + req.files.image.name;
	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function(err) {
		if (err) throw err;
		im.identify(target_path, function(err, features) {
			if (err) throw err;
			console.log(features.width, features.height);
			if(features.width > 700) {
				im.resize({
					srcPath: target_path,
					dstPath: image_large,
					width: 700,
				}, function(err, stdout, stderr) {
					if (err) throw err;
					console.log("resized image to width 700px");
				});
			} else {
				ncp(target_path, image_large, function(err) {
					if (err) throw err;
					console.log("original image copied to /large dir"); 
				});
			}
		});
		im.resize({
			srcPath: target_path,
			dstPath: thumb_large,
			width: 200,
			height: "200^",
			customArgs: [
				"-gravity", "center",
				"-extent", "200x200"
			]
		}, function(err, stdout, stderr) {
			if (err) throw err;
			console.log("resized image to fit within 200x200px");
		});
		im.resize({
			srcPath: target_path,
			dstPath: thumb_medium,
			width: 80,
			height: "80^",
			customArgs: [
				"-gravity", "center",
				"-extent", "80x80"
			]
		}, function(err, stdout, stderr) {
			if (err) throw err;
			console.log("resized image to fit within 80x80px");
		});
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
    		console.log("yay");
    	}
    });
}

exports.addImages = function(req, res) {
	// TODO: Something is wrong with target_path and the other paths i think
	var newId = (images.length > 0) ? (images[images.length-1].id + 1) : 0;
    for(var image in req.files.images) {
		//console.log(req.files.images[image].path);
		if (req.files.images.hasOwnProperty(image)) {
			var newJson =  {
					"id": newId,
					"imageurl": req.files.images[image].name,
					"title": "**temp",
			};
			// get the temporary location of the file
			var tmp_path = req.files.images[image].path;
			// set where the file should actually exists - in this case it is in the "images" directory
			var target_path = __dirname + '/assets/images/orig/' + req.files.images[image].name;
			var image_large = __dirname + '/assets/images/large/' + req.files.images[image].name;
			var thumb_large = __dirname + '/assets/images/thumb/large/' + req.files.images[image].name;
			var thumb_medium = __dirname + '/assets/images/thumb/medium/' + req.files.images[image].name;

			//console.log(tmp_path, target_path, thumb_large, thumb_medium);

			// move the file from the temporary location to the intended location
			upload(tmp_path, target_path, thumb_large, thumb_medium);
    		// Append new json to images object
    		images.push(newJson);
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("yay");
    			}
    		});
    	}
		newId++;
    }

    function upload(tmp, target, thumb_l, thumb_m) {
    	console.log("upload called: ", tmp, target, thumb_l, thumb_m);
    	// TODO: these urls are OK. But im.resize fucks it up... 
		/*im.resize({
			srcPath: target,
			dstPath: thumb_l,
			width: 200,
			height: "200^",
			customArgs: [
				"-gravity", "center",
				"-extent", "200x200"
			]
		}, function(err, stdout, stderr) {
			if (err) throw err;
			console.log("resized image to fit within 200x200px", thumb_l);

		});
		im.resize({
			srcPath: target,
			dstPath: thumb_m,
			width: 80,
			height: "80^",
			customArgs: [
				"-gravity", "center",
				"-extent", "80x80"
			]
		}, function(err, stdout, stderr) {
			if (err) throw err;
			console.log("resized image to fit within 80x80px", thumb_m);
		});*/
		fs.rename(tmp, target, function(err) {
			if (err) throw err;
			/*im.identify(target_path, function(err, features) {
				if (err) throw err;
				console.log(features.width, features.height);
				if(features.width > 700) {
					im.resize({
						srcPath: target_path,
						dstPath: image_large,
						width: 700,
					}, function(err, stdout, stderr) {
						if (err) throw err;
						console.log("resized image to width 700px");
					});
				} else {
					ncp(target_path, image_large, function(err) {
						if (err) throw err;
						console.log("original image copied to /large dir"); 
					});
				}
			});*/
			// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
			/*fs.unlink(tmp_path, function() {
				if (err) throw err;
				console.log('File uploaded to: ' + target_path + ' - ?? bytes');
			});*/
		});
    }
}

exports.editImage = function(req, res, id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            var origCategory = images[i].category;
            var imageId = images[i].id;
            var imageUrl = images[i].imageurl;
			var category = req.body.newcategory ? req.body.newcategory : req.body.category ? req.body.category : origCategory; 
			var newJson =  {
					"id": imageId,
					"category": category,
					"imageurl": imageUrl,
					"title": req.body.title,
					"description": req.body.description,
					"featured": req.body.featured
			};
            // delete old images object
            images.splice(i, 1);
    		// Append new json to images object
    		images.push(newJson);
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("yay");
    			}
    		});
        }
    }
}

exports.deleteImage = function(id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            var imageId = images[i].id;
            images.splice(i, 1);
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("image with id: " + imageId + " is deleted");
    			}
    		});
        }
    }
}

exports.muteImage = function(id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            var imageId = images[i].id;
			images[i]["muted"] = "on";
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("image with id: " + imageId + " is muted");
    			}
    		});
        }
    }
}

exports.unmuteImage = function(id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            var imageId = images[i].id;
			delete images[i]["muted"];
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("image with id: " + imageId + " is unmuted");
    			}
    		});
        }
    }
}

exports.featureImage = function(id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            var imageId = images[i].id;
			images[i]["featured"] = "on";
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("image with id: " + imageId + " is featured");
    			}
    		});
        }
    }
}

exports.unfeatureImage = function(id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
            var imageId = images[i].id;
			delete images[i]["featured"];
    		fs.writeFile(file, JSON.stringify(images, null, 4), function(err) {
    			if (err) {
    				console.log(err);
    			} else {
    				console.log("image with id: " + imageId + " is unfeatured");
    			}
    		});
        }
    }
}

exports.getLastId = function() {
	return images[images.length-1].id;
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

exports.getFeaturedImages = function() {
    var results = [];
    for(var i=0; i < images.length; i++) {
        if(images[i].featured && !images[i].muted) {
            results.push(images[i]);
        }
    }
	return results;
}

exports.getAllImages = function() {
	var results = [];
    for(var i=0; i < images.length; i++) {
    	results.push(images[i]);
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

var fs = require('fs');
var im = require('imagemagick');
var ncp = require('ncp');
var imagesFile = __dirname + '/assets/json/images.json';
var categoriesFile = __dirname + '/assets/json/categories.json';
var images = [];
var categories = [];

fs.readFile(imagesFile, 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}
	images = JSON.parse(data);
});

fs.readFile(categoriesFile, 'utf8', function (err, data) {
	if (err) {
		console.log('Error: ' + err);
		return;
	}
	categories = JSON.parse(data);
});

  
exports.addImage = function(req, res) {
	var newId = Math.random().toString(36).substr(2,6);
	//var newId = (images.length > 0) ? (images[images.length-1].id + 1) : 0;
	var catId = req.body.category.split("-")[0]; 
	var subCatId = req.body.category.split("-")[1]; 
	var newJson =  {
			"id": newId,
			"catId": catId,
			"subCatId": subCatId,
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
    fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
    	if (err) {
    		console.log(err);
    	} else {
    		console.log("yay");
    	}
    });
}

exports.addImages = function(req, res) {
	console.log(req.files);
	if(req.files.images.length) {

		var newId = Math.random().toString(36).substr(2,6);
		var catId = req.body.category.split("-")[0]; 
		var subCatId = req.body.category.split("-")[1]; 

    	for(var image in req.files.images) {
			//console.log(req.files.images[image].path);
			if (req.files.images.hasOwnProperty(image)) {
				//.match(/\.(jpg|jpeg|png)$/i)
				var extension = req.files.images[image].name.split('.').pop();
				var newName = "sassi_bischoff_" + Math.random().toString(36).substr(2,6) + "." + extension;
				var newJson =  {
						"id": Math.random().toString(36).substr(2,6),
						"catId": catId,
						"subCatId": subCatId,
						"imageurl": newName,
						"title": "**temp",
				};
				// get the temporary location of the file
				var tmp_path = req.files.images[image].path;
				// set where the file should actually exists - in this case it is in the "images" directory
				var target_path = __dirname + '/assets/images/orig/' + newName;
				var image_large = __dirname + '/assets/images/large/' + newName;
				var thumb_large = __dirname + '/assets/images/thumb/large/' + newName;
				var thumb_medium = __dirname + '/assets/images/thumb/medium/' + newName;

				//console.log(tmp_path, target_path, thumb_large, thumb_medium);

				// move the file from the temporary location to the intended location
				upload(tmp_path, target_path, image_large, thumb_large, thumb_medium);
    			// Append new json to images object
    			images.push(newJson);
    			fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
    				if (err) {
    					console.log(err);
    				} else {
    					console.log("yay");
    				}
    			});
    		}
			newId++;
    	}

    	function upload(tmp, target, image_l, thumb_l, thumb_m) {
			fs.rename(tmp, target, function(err) {
				if (err) throw err;

				im.resize({
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
					//console.log("resized image to fit within 200x200px", thumb_l);

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
						//console.log("resized image to fit within 80x80px", thumb_m);

						im.identify(target, function(err, features) {
							if (err) throw err;
							//console.log(features.width, features.height);
							if(features.width > 700) {
								im.resize({
									srcPath: target,
									dstPath: image_l,
									width: 700,
								}, function(err, stdout, stderr) {
									if (err) throw err;
									//console.log("resized image to width 700px");
								});
							} else {
								ncp(target, image_l, function(err) {
									if (err) throw err;
									//console.log("original image copied to /large dir"); 
								});
							}
						});
						// delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
						fs.unlink(tmp_path, function() {
							if (err) throw err;
							//console.log('File uploaded to: ' + target_path + ' - ?? bytes');
						});
					});

				});
			});
    	}
    }
}

exports.editImage = function(req, res, id) {
    for(var i=0; i < images.length; i++) {
        if(images[i].id == id) {
			var catId = req.body.category.split("-")[0]; 
			var subCatId = req.body.category.split("-")[1]; 
			var newJson =  {
					"id": images[i].id,
					"catId": catId ? catId : images[i].catId,
					"subCatId": subCatId ? subCatId : images[i].subCatId,
					"imageurl": images[i].imageurl,
					"title": req.body.title,
					"description": req.body.description,
					"featured": req.body.featured
			};
            // delete old images object
            images.splice(i, 1);
    		// Append new json to images object
    		images.push(newJson);
    		fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
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
    		fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
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
    		fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
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
    		fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
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
    		fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
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
    		fs.writeFile(imagesFile, JSON.stringify(images, null, 4), function(err) {
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

exports.addCategory = function(req, res) {
	var newCatId = Math.random().toString(36).substr(2,6);
	var newJson =  {
		"id": newCatId,
		"name": req.body.category,
		"active": true
	};
    // Append new json to categories object
	categories.push(newJson);
	fs.writeFile(categoriesFile, JSON.stringify(categories, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("yay");
		}
	});
}

exports.editCategory = function(req, res) {
    for ( var i=0; i < categories.length; i++ ) {
    	if (categories[i].id == req.body.category) {
    		categories[i].name = req.body.newcategory;
    	}
    }
    // Append new json to categories object
	fs.writeFile(categoriesFile, JSON.stringify(categories, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("yay");
		}
	});
}

exports.deleteCategory = function(id) {
    for ( var i=0; i < categories.length; i++ ) {
    	if (categories[i].id == id) {
            categories.splice(i, 1);
    	}
    }
    // Append new json to categories object
	fs.writeFile(categoriesFile, JSON.stringify(categories, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("yay");
		}
	});
}

exports.deleteSubCategory = function(id) {
    for ( var i=0; i < categories.length; i++ ) {
    	if (categories[i].subcategory) {
    		var subcategories = categories[i].subcategory;
    		for ( var j=0; j < subcategories.length; j++ ) {
        		if (subcategories[j].id == id) {
            		subcategories.splice(j, 1);
        		}
        	}
        }
    }
    // Append new json to categories object
	fs.writeFile(categoriesFile, JSON.stringify(categories, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("yay");
		}
	});
}

exports.addSubCategory = function(req, res) {
	var newSubCatId = Math.random().toString(36).substr(2,6);
	var newJson =  {
		"id": newSubCatId,
		"name": req.body.subcategory
	};
    // Append new json to categories object
    for ( var i=0; i < categories.length; i++ ) {
    	if (categories[i].id == req.body.category) {
    		if (categories[i].subcategory) {
				var newJson =  {
					"id": newSubCatId,
					"name": req.body.subcategory
				};
    			categories[i].subcategory.push(newJson);
    		} else {
				var newJson =  [{
					"id": newSubCatId,
					"name": req.body.subcategory
				}];
    			categories[i].subcategory = newJson;
    		}
    	}
    }
	fs.writeFile(categoriesFile, JSON.stringify(categories, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("yay");
		}
	});
}

exports.editSubCategory = function(req, res) {
	var catId = req.body.subcategory.split("-")[0]; 
	var subCatId = req.body.subcategory.split("-")[1]; 
    for ( var i=0; i < categories.length; i++ ) {
    	if (categories[i].id == catId) {
    		if (categories[i].subcategory) {
    			var subcategories = categories[i].subcategory;
    			for ( var j=0; j < subcategories.length; j++ ) {
        			if (subcategories[j].id == subCatId) {
        				subcategories[j].name = req.body.newsubcategory;
        			}
        		}
        	}
    	}
    }
    // Append new json to categories object
	fs.writeFile(categoriesFile, JSON.stringify(categories, null, 4), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("yay");
		}
	});
}

exports.getCategories = function(catId) {
    var result = [];
    for ( var i=0; i < categories.length; i++ ) {
        if (catId && categories[i].id == catId) {
        	result.push(categories[i]);
        } else {
        	result.push(categories[i]);
        }
    }
    return result;
}

exports.getCategoryName = function(catId) {
    for ( var i=0; i < categories.length; i++ ) {
        if (categories[i].id == catId) {
        	var result = categories[i].name;
        }
    }
    return result;
}

exports.getCategoryNameByImageId = function(id) {
    var result = {};
    for ( var i=0; i < images.length; i++ ) {
        if (images[i].id == id) {
    		for ( var j=0; j < categories.length; j++ ) {
        		if (categories[j].id == images[i].catId) {
        			result.catName = categories[j].name;
    				var subcategories = categories[j].subcategory;
    				if (subcategories) {
    					for ( var k=0; k < subcategories.length; k++ ) {
        					if (subcategories[k].id == images[i].subCatId) {
        						result.subCatName = subcategories[k].name;
        					}
        				}
        			}
        		}
        	}
        }
    }
    return result;
}

exports.getCategoryId = function(cat) {
    for ( var i=0; i < categories.length; i++ ) {
        if (categories[i].name == cat) {
        	var result = categories[i].id;
        }
    }
    return result;
}

exports.getSubCategoryName = function(cat, subCatId) {
    for ( var i=0; i < categories.length; i++ ) {
        if (categories[i].name == cat) {
    		var subcategories = categories[i].subcategory;
    		for ( var j=0; j < subcategories.length; j++ ) {
        		if (subcategories[j].id == subCatId) {
        			var result = subcategories[j].name;
        		}
        	}
        }
    }
    return result;
}

exports.getImagesByCategory = function(cat, subcat) {
    var results = [];
    var catId = exports.getCategoryId(cat);
    for(var i=0; i < images.length; i++) {
        if(images[i].catId == catId && images[i].subCatId == subcat) {
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

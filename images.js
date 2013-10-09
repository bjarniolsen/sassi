var fs = require('fs');
var file = __dirname + '/assets/json/images.json';
var images = [];
  
fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    images = JSON.parse(data);
});

exports.setImage = function(json) {
    console.log(json);
    images.push(json);
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

var images = [
    {
        "id": 1,
        "category": "malerier",
        "title": "Solsikker"
    },
    {
        "id": 2,
        "category": "malerier",
        "title": "Roser"
    },
    {
        "id": 3,
        "category": "bodypaint",
        "title": "Mur"
    },
    {
        "id": 4,
        "category": "malerier",
        "title": "Robotter og dyr"
    },
    {
        "id": 5,
        "category": "malerier",
        "title": "Vindhekse"
    } ,
    {
        "id": 6,
        "category": "Julekort",
        "title": "Vindhekse"
    }
];

exports.getCategories = function(req, res) {
   var arr = {};

   for ( var i=0; i < images.length; i++ ) {
       arr[images[i]['category']] = images[i];
   }

   result = new Array();
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
